package main

import (
	"os"
	"time"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/application"
	"github.com/egel/greenheat-golang-nextjs/v2/internal/infrastructure/envvars"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

func main() {
	// envvars
	envvars.CheckAndPrintAllMandatoryEnvVars("")
	env := envvars.EnvvarsSetup()

	// logger
	zerolog.TimeFieldFormat = time.RFC3339Nano
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
	if env.IsProduction() {
		// in production set log level from INFO up
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}
	if env.IsDevelopment() {
		// INFO: ConsoleWrite is inefficient for prod environment, although
		// it may be better to read while developing
		output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339Nano}
		log.Logger = log.Output(output).With().Timestamp().Caller().Logger()
	}

	appOptions := application.NewAppOptions()
	serverAddress := envvars.GetServerHostAddr(env)
	app := application.Initialize(appOptions, serverAddress)
	app.Start()
}
