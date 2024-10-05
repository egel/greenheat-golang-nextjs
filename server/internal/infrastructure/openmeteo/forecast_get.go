package openmeteo

import (
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

// ForecastGet make request to open meteo and fetch data
func ForecastGet(ctx *gin.Context, lat float64, lng float64) (body []byte, err error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		"", // update URL later
		nil,
	)
	if err != nil {
		msg := "creating newRequestWithContext failed" // TODO: extract to errors
		// log.Error().Err(err).Msg(msg)
		return nil, fmt.Errorf(msg)
	}

	openMeteoUrl := &url.URL{
		Scheme: "https",              // TODO: can me moved later to env vars
		Host:   "api.open-meteo.com", // TODO: can be moved to env vars
		Opaque: fmt.Sprintf("/v1/forecast?latitude=%f&long", lat, lng),
	}
	req.URL = openMeteoUrl

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		errMsg := "openmeteo forecast get method failed"
		// log.Error().Err(err).Msg(errMsg)
		return nil, fmt.Errorf(errMsg)
	}
	defer resp.Body.Close()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		errMsg := "io readall failed"
		// log.Error().Err(err).Msg(errMsg)
		return nil, fmt.Errorf(errMsg)
	}

	return body, nil

}
