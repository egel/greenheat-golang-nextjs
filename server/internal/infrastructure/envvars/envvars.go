package envvars

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/egel/greenheat-golang-nextjs/v2/internal/constans"
	"github.com/egel/greenheat-golang-nextjs/v2/internal/constans/errors"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

var (
	_environment    = "ENVIRONMENT"
	_serverProtocol = "SERVER_PROTOCOL"
	// serverHost aims for server itself, e.g.: 127.0.0.1, 0.0.0.0
	_serverHost = "SERVER_HOST"
	_serverPort = "SERVER_PORT"
	// serverName aims for external server name, e.g.: staging.example.com
	_serverName      = "SERVER_NAME"
	_serverApiPrefix = "SERVER_API_PREFIX"
)

// Config holds current environment variables configuration
var Config *envvars

// envvars define structure of available environment variables
type envvars struct {
	Environment string

	// Server
	ServerProtocol  string
	ServerHost      string
	ServerPort      int
	ServerName      string
	ServerApiPrefix string
}

// osVariable define the OS variable and its accessibility
type osVariable struct {
	name      string
	publicity string
}

var (
	publicVariable  = "public"
	privateVariable = "private"
)

var mandatoryEnvironmentVariables = []osVariable{
	{
		name:      _environment,
		publicity: publicVariable,
	},

	// Server
	{
		name:      _serverProtocol,
		publicity: publicVariable,
	},
	{
		name:      _serverHost,
		publicity: publicVariable,
	},
	{
		name:      _serverPort,
		publicity: publicVariable,
	},
	{
		name:      _serverName,
		publicity: publicVariable,
	},
	{
		name:      _serverApiPrefix,
		publicity: publicVariable,
	},
}

// loadEnvironmentVariablesFromDotEnvFile load and read env variables from
// .env file or return error
func loadEnvironmentVariablesFromDotEnvFile(configFilePath string) error {
	log.Debug().
		Str("configFilePath", configFilePath).
		Msg("preview initial args for loadEnvironmentVariablesFromDotEnvFile")

	if len(configFilePath) == 0 {
		configFilePath = constans.Envvars_filename
	}

	err := godotenv.Load(configFilePath)
	if err != nil {
		errMsg := fmt.Sprintf(errors.Err3rdParty_Godotenv_read_failed, configFilePath, err)
		return fmt.Errorf(errMsg)
	}
	return nil
}

// newEnvvars read and return pointer to environment variables
func newEnvvars() *envvars {
	serverPortRawValue := os.Getenv(_serverPort)
	serverPort, err := strconv.Atoi(serverPortRawValue)
	if err != nil {
		log.Fatal().
			Err(err).
			Str("variable", _serverPort).
			Str("value", serverPortRawValue).
			Msg(errors.Err3rdParty_Godotenv_parsing)
	}

	return &envvars{
		Environment: os.Getenv(_environment),

		// Server
		ServerProtocol:  os.Getenv(_serverProtocol),
		ServerHost:      os.Getenv(_serverHost),
		ServerPort:      serverPort,
		ServerName:      os.Getenv(_serverName),
		ServerApiPrefix: os.Getenv(_serverApiPrefix),
	}
}

// CheckAndPrintAllMandatoryEnvVars checking all server required variables
// and print them on screen
func CheckAndPrintAllMandatoryEnvVars(envFilePath string) {
	path, err := os.Getwd()
	if err != nil {
		log.Error().Err(err).Msg("not able to get server working directory")
	} else {
		log.Info().Str("program start path", path).Send()
	}

	if strings.ToLower(os.Getenv("ENVIRONMENT")) != "production" {
		log.Info().Str("envFilePath", envFilePath).Msg("trying to READ variables from .env file")
		err := loadEnvironmentVariablesFromDotEnvFile(envFilePath)
		if err != nil {
			log.Error().Err(err).Send()
			// do not return here (allow to pass) as env vars can be set up with
			// different ways (inline, os, etc.)
		} else {
			log.Info().Msg("env vars loaded successfully")
		}
	}

	// Checking mandatory env variables
	for _, v := range mandatoryEnvironmentVariables {
		val, err := os.LookupEnv(v.name)
		if !err {
			log.Panic().
				Str("variable", v.name).
				Msg("missing the mandatory environment variable")
		}
		msg := "mandatory ENV variable"
		if v.publicity == publicVariable {
			log.Info().
				Str("variable", v.name).
				Str("value", val).
				Msg(msg)
		} else {
			log.Info().
				Str("variable", v.name).
				Str("value", "****** (hidden)").
				Msg(msg)
		}
	}
}

// EnvvarsSetup create new envvars and return it as the pointer
func EnvvarsSetup() *envvars {
	Config = newEnvvars()
	return Config
}

// IsDevelopment return true if environment is set to development, else false
func (env *envvars) IsDevelopment() bool {
	return strings.ToLower(env.Environment) == "development"
}

// IsProduction return true if environment is set to production, else false
func (env *envvars) IsProduction() bool {
	return strings.ToLower(env.Environment) == "production"
}

// GetServerHostAddr return string with server host address with server name
// and port
//
// example: 127.0.0.1:8000, 0.0.0.0:8000
func GetServerHostAddr(env *envvars) string {
	return fmt.Sprintf("%s:%d", env.ServerHost, env.ServerPort)
}
