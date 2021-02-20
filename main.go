package main

import (
	"database/sql"
	"embed"
	"fmt"
	"github.com/agathver/sqlpad/file_server"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"io/fs"
	"net/http"
	"net/url"
	"os"
	"reflect"
)

//go:embed client/build/* client/build/static/css/* client/build/static/js/*
var content embed.FS
var version = "dev"
var build = "debug"

func main() {
	fmt.Printf("Starting SQLPad - %s-%s\n", version, build)

	gin.SetMode(build)
	sessionStore := map[string]*sql.DB{}

	r := gin.Default()

	r.POST("/api/session", func(c *gin.Context) {

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

	r.POST("/api/session/:session_id/execute", func(c *gin.Context) {
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

	sub, err := fs.Sub(content, "client/build")

	if err != nil {
		panic(err)
	}

	r.NoRoute(file_server.Serve("/", "/", sub))

	listenAddress := os.Getenv("LISTEN_ADDR")
	if listenAddress == "" {
		listenAddress = "127.0.0.1:8080"
	}

	fmt.Printf("Starting server at http://%s\n", listenAddress)
	err = r.Run(listenAddress)

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
