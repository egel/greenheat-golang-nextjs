package main

import (
	"os"
	"time"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/application"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

func main() {
	// logger
	zerolog.TimeFieldFormat = time.RFC3339Nano
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	// TODO: if in production set log level from INFO when env vars available

	// TODO: ConsoleWrite is inefficient for prod environment
	output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339Nano}
	log.Logger = log.Output(output).With().Timestamp().Caller().Logger()

	appOptions := application.NewAppOptions()
	app := application.Initialize(appOptions)
	app.Start()
}
