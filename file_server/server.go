package file_server

import (
	"github.com/gin-gonic/gin"
	"io/fs"
	"net/http"
	"os"
	"path"
	"strings"
)

func Serve(prefix string, defaultPath string, fs fs.FS) gin.HandlerFunc {
	fileSystem := http.FS(fs)
	server := http.StripPrefix(prefix, http.FileServer(fileSystem))

	return func(c *gin.Context) {
		cleanPath := strings.TrimPrefix(path.Clean(c.Request.URL.Path), prefix)
		_, err := fs.Open(cleanPath)

		if os.IsNotExist(err) {
			defer func(old string) {
				c.Request.URL.Path = old
			}(c.Request.URL.Path)

			c.Request.URL.Path = defaultPath
		}

		server.ServeHTTP(c.Writer, c.Request)
	}
}
