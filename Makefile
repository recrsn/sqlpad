JS_SRC = $(shell find client/src -type f)
PUBLIC = $(shell find client/public -type f)
GO_SRC = $(shell find . -path ./client -prune -false -o -type f -name '*.go')

BUILD_CMD = go build -ldflags '-s -w -X main.build=release'
PKG_CMD = upx -q

.PHONY: clean all test

all: test pkg

client/build: $(JS_SRC) $(PUBLIC) client/package-lock.json client/craco.config.js client/tailwind.config.js client/tsconfig.json
	cd client; npm run build

build/sqlpad-darwin-amd64: client/build $(GO_SRC) go.mod go.sum Makefile
	mkdir -p build
	GOOS=darwin GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-darwin-amd64" .

build/sqlpad-linux-amd64: client/build $(GO_SRC) go.mod go.sum Makefile
	mkdir -p build
	GOOS=linux GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-linux-amd64" .

build/sqlpad-windows-amd64.exe: client/build $(GO_SRC) go.mod go.sum Makefile
	mkdir -p build
	GOOS=windows GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-windows-amd64.exe" .

build: build/sqlpad-darwin-amd64 build/sqlpad-linux-amd64 build/sqlpad-windows-amd64.exe
	@touch build

pkg/sqlpad-darwin-amd64: build/sqlpad-darwin-amd64
	mkdir -p pkg
	$(PKG_CMD) -o "pkg/sqlpad-darwin-amd64" "build/sqlpad-darwin-amd64"

pkg/sqlpad-linux-amd64: build/sqlpad-linux-amd64
	mkdir -p pkg
	$(PKG_CMD) -o "pkg/sqlpad-linux-amd64" "build/sqlpad-linux-amd64"

pkg/sqlpad-windows-amd64.exe: build/sqlpad-windows-amd64.exe
	mkdir -p pkg
	$(PKG_CMD) -o "pkg/sqlpad-windows-amd64.exe" "build/sqlpad-windows-amd64.exe"

pkg: pkg/sqlpad-darwin-amd64 pkg/sqlpad-linux-amd64 pkg/sqlpad-windows-amd64.exe
	@touch pkg

test:
	go test -cover ./...

clean:
	rm -rf client/build build
