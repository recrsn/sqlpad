JS_SRC = $(shell find client/src -type f)
PUBLIC = $(shell find client/public -type f)
GO_SRC = $(shell find . -path ./client -prune -false -o -type f -name '*.go')

BUILD_CMD = go build -ldflags '-X main.build=release'

.PHONY: clean all test

all: test

client/build: $(JS_SRC) $(PUBLIC) client/package-lock.json client/craco.config.js client/tailwind.config.js client/tsconfig.json
	cd client; npm run build

build/sqlpad-darwin-amd64: client/build test
	mkdir -p build
	GOOS=darwin GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-darwin-amd64" .

build/sqlpad-linux-amd64: client/build test
	mkdir -p build
	GOOS=linux GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-linux-amd64" .

build/sqlpad-windows-amd64.exe: client/build test
	mkdir -p build
	GOOS=windows GOARCH=amd64 $(BUILD_CMD) -o "build/sqlpad-windows-amd64.exe" .

build: build/sqlpad-darwin-amd64 build/sqlpad-linux-amd64 build/sqlpad-windows-amd64.exe
	@touch build

test:
	go test -cover ./...

clean:
	rm -rf client/build build
