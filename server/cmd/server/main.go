package main

import (
	"github.com/egel/greenheat-golang-nextjs/v2/internal/application"
)

func main() {
	appOptions := application.NewAppOptions()
	app := application.Initialize(appOptions)
	app.Start()
}
