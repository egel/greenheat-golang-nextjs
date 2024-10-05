package application

import (
	"net/http"

	v1 "github.com/egel/greenheat-golang-nextjs/v2/internal/controller/http/v1"
)

// AppOptions define optional configurations for the app
type AppOptions struct {
	// GracefulShutdownTime time.Duration // TODO: add maybe when time will allow
}

func NewAppOptions() *AppOptions {
	return &AppOptions{}
}

// App define the structure of the application
type App struct {
	Server  *http.Server
	Options *AppOptions
}

func newApp(handler http.Handler, serverAddress string, options *AppOptions) *App {
	return &App{
		Server: &http.Server{
			Addr:    serverAddress,
			Handler: handler,
		},
		Options: options,
	}
}

func Initialize(
	appOptions *AppOptions,
) *App {
	httpHandler := v1.NewHttpHandler()
	return newApp(httpHandler, "localhost:9000", appOptions) // TODO: move to env vars
}

func (app *App) Start() {
	app.Server.ListenAndServe()
	// log.Info().Msg("Server exiting")
}
