package v1

import (
	"net/http"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/constans"
	"github.com/gin-gonic/gin"
)

func homeHandler(ctx *gin.Context) {
	jsonData := []byte(`hello`)
	ctx.Data(http.StatusOK, constans.ContentType_TextPlain, jsonData)
}
