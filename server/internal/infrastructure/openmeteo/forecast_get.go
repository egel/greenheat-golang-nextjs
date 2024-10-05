package openmeteo

import (
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/constans/errors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

// ForecastGet make request to open meteo and fetch data
func ForecastGet(ctx *gin.Context) (body []byte, err error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		"",
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf(errors.ErrHttp_NewRequestWithContext)
	}

	// Decision:
	// This request is basically a proxy, so I make a shortcut and reuse full
	// raw queryParam and pass it forward to simplify.
	// if there is a need to pass more "personal params" feel free to extend
	rawQueryParam := ctx.Request.URL.RawQuery
	log.Debug().Any("rawQueryParam", rawQueryParam).Msg("preview")

	urlPrefix := "/v1/forecast"
	var opaque string
	// when query not empty treat it that way else send empty
	if len(rawQueryParam) > 0 {
		opaque = fmt.Sprintf(
			"%s?%v",
			urlPrefix,
			rawQueryParam,
		)
	} else {
		opaque = urlPrefix
	}
	log.Debug().Any("opaque", opaque).Msg("preview")

	openMeteoUrl := &url.URL{
		Scheme: "https",              // TODO: can me moved later to env vars
		Host:   "api.open-meteo.com", // TODO: can be moved to env vars
		Opaque: opaque,
	}
	log.Debug().Any("URL", openMeteoUrl).Msg("preview")
	req.URL = openMeteoUrl

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf(errors.ErrExternal_request_openmeteo_forecast)
	}
	defer resp.Body.Close()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf(errors.ErrIO_ReadAll)
	}

	return body, nil

}
