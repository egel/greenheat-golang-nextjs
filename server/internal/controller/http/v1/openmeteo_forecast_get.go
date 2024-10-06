package v1

import (
	"encoding/json"
	"net/http"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/constans/errors"
	"github.com/egel/greenheat-golang-nextjs/v2/internal/infrastructure/openmeteo"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func forecastGetOpenmeteoHandler(ctx *gin.Context) {
	body, err := openmeteo.ForecastGet(ctx)
	if err != nil {
		log.Error().Err(err).Msg(errors.ErrExternal_request_openmeteo_forecast)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.ErrExternal_request_openmeteo_forecast) // TODO: wrap with own error message
		return
	}

	// unmarshal
	var msg any
	if err := json.Unmarshal(body, &msg); err != nil {
		log.Error().Err(err).Msg(errors.ErrJson_Unmarshal)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.ErrJson_Unmarshal) // TODO: wrap with own error message
		return
	}

	log.Info().Any("message", msg).Msg("successfully get forecast")
	ctx.JSON(http.StatusOK, msg)
}
