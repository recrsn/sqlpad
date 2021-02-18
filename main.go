package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"net/url"
	"reflect"
	"time"

	"database/sql"
	_ "github.com/lib/pq"
)

func main() {

	sessionStore := map[string]*sql.DB{}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH"},
		AllowHeaders: []string{"*"},
		MaxAge:       12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST("/login", func(c *gin.Context) {

		type loginRequest struct {
			URL string `json:"url"`
		}

		type loginResponse struct {
			SessionID string `json:"sessionId"`
		}

		var req loginRequest

		_ = c.BindJSON(&req)
		dbURL, _ := url.Parse(req.URL)

		sessionID := uuid.New().String()

		if dbURL.Scheme == "postgres" {
			conn, err := sql.Open("postgres", req.URL)

			sessionStore[sessionID] = conn

			if err != nil {
				_ = c.Error(err)
				return
			}

			c.JSON(http.StatusOK, &loginResponse{SessionID: sessionID})
			return

		} else {
			_ = c.Error(newHttpError(http.StatusBadRequest, "Unsupported database"))
			return
		}
	})

	r.POST("/session/:session_id/execute", func(c *gin.Context) {
		sessionID := c.Params.ByName("session_id")

		type execReq struct {
			Sql string `json:"sql"`
		}

		var req execReq
		_ = c.BindJSON(&req)

		db := sessionStore[sessionID]

		rows, err := db.Query(req.Sql)

		if err != nil {
			panic(err)
		}

		defer func() {
			err := rows.Close()
			panic(err)
		}()

		columnNames, _ := rows.Columns()

		var data [][]interface{}

		for rows.Next() {
			columnTypes, err := rows.ColumnTypes()

			if err != nil {
				panic(err)
			}
			row := makeRow(columnTypes)
			err = rows.Scan(row...)

			if err != nil {
				panic(err)
			}
			data = append(data, row)
		}

		c.JSON(http.StatusOK, gin.H{
			"columns": columnNames,
			"data":    data,
		})

	})
	err := r.Run()

	if err != nil {
		panic(err)
	}
}

func makeRow(types []*sql.ColumnType) []interface{} {
	var row []interface{}

	for _, colType := range types {
		value := reflect.Zero(colType.ScanType())
		valueInterface := value.Interface()
		row = append(row, &valueInterface)
	}

	return row
}

type httpError struct {
	statusCode int
	Message    string
}

func (h httpError) Error() string {
	return h.Message
}

func newHttpError(statusCode int, message string) error {
	return httpError{statusCode, message}
}
