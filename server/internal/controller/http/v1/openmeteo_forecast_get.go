package v1

import (
	"encoding/json"
	"net/http"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/infrastructure/openmeteo"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func forecastGetOpenMeteoHandler(ctx *gin.Context) {
	body, err := openmeteo.ForecastGet(ctx)
	if err != nil {
		errMsg := "ForecastGet failed"
		log.Error().Err(err).Msg(errMsg)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errMsg) // TODO: wrap with own error message
		return
	}

	// unmarshal
	var msg any
	if err := json.Unmarshal(body, &msg); err != nil {
		errMsg := "Unmarshal failed"
		log.Error().Err(err).Msg(errMsg)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errMsg) // TODO: wrap with own error message
		return
	}

	log.Info().Any("message", msg).Msg("successfully get forecast")
	ctx.JSON(http.StatusOK, msg)
}
