BINARY_NAME=server
BINARY_DIR=bin/server
SERVER_DIR=cmd/server

# change default shell (for using source)
SHELL := /bin/bash

.PHONY: build
build:
	# build for current platform
	go build -o ${BINARY_DIR}/${BINARY_NAME} ${SERVER_DIR}/main.go

# run - just execute the server binary file
.PHONY: run
run:
	./${BINARY_DIR}/${BINARY_NAME}

# build and run server (with some useful cleanup/format commands to always
# keep code clean)
.PHONY: build_and_run
build_and_run: build run

