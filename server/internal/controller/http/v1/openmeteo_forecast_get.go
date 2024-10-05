package v1

import (
	"encoding/json"
	"net/http"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/infrastructure/openmeteo"
	"github.com/gin-gonic/gin"
)

func forecastGetOpenMeteoHandler(ctx *gin.Context) {
	// FIXME: just to test for now
	lat := 52.52437
	lng := 13.41053

	body, err := openmeteo.ForecastGet(ctx, lat, lng)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, err) // TODO: wrap with own error message
		return
	}

	// unmarshal
	var msg string
	if err := json.Unmarshal(body, &msg); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, err) // TODO: wrap with own error message
		return
	}

	ctx.JSON(http.StatusOK, body)
}
