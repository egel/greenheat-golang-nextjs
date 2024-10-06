package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewHttpHandler() http.Handler {
	r := gin.New()

	// Recovery middleware recovers from any panics and writes a 500 if there was one.
	r.Use(gin.Recovery())

	// homeHandler hold friendly hello message. Use to test if api is available.
	r.GET("/", homeHandler)

	v1 := r.Group("/v1")
	{
		/* =====================================================================
		Publicly available for not logged users
		*/
		v1.GET("/openmeteo/forecast", forecastGetOpenmeteoHandler)
		v1.GET("/openmeteo/geosearch", geosearchGetOpenmeteoHandler)
	}

	return r
}
