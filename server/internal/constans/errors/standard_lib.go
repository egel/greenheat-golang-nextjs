package errors

const (
	// IO
	ErrIO_ReadAll = "readall bytes failed"

	// HTTP
	ErrHttp_NewRequestWithContext = "creating NewRequestWithContext failed"

	// Json
	ErrJson_Marshal   = "marshal object failed"
	ErrJson_Unmarshal = "unmarshal object failed"
)
