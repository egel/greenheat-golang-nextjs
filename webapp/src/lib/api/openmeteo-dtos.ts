export interface GeoSearchItem {
  admin1: string;
  admin1_id: number;
  admin2: string;
  admin2_id: number;
  admin3: string;
  admin3_id: number;
  admin4: string;
  admin4_id: number;
  country: string;
  country_code: string;
  country_id: number;
  elevation: number;
  feature_code: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  population: number;
  timezone: string;
}

export interface ForecastGetQueryParams {
  latitude: number;
  longitude: number;
  current: string;
  hourly: string;
  daily: string;
}

export interface ForecastGetCurrentUnits {
  interval: string;
  is_day: string;
  relative_humidity_2m: string;
  temperature_2m: string;
  time: string;
}

export interface ForecastGetCurrent {
  interval: number;
  is_day: number;
  relative_humidity_2m?: number;
  temperature_2m?: number;
  time: string;
  weather_code?: number;
  wind_direction_10m?: number;
  wind_speed_10m?: number;
}

export interface ForecastGetDailyUnits {
  temperature_2m_max?: string;
  temperature_2m_min?: string;
  relative_humidity_2m?: number;
  time?: string;
  wind_direction_10m?: string;
  wind_speed_10m?: string;
}

export interface ForecastGetDaily {
  temperature_2m_max?: Array<number>;
  temperature_2m_min?: Array<number>;
  time?: Array<string>;
}

export interface ForecastGetResponse {
  current?: ForecastGetCurrent;
  current_units?: ForecastGetCurrentUnits;
  dailyi?: ForecastGetDaily;
  daily_units?: ForecastGetDailyUnits;
  elevation?: number;
  generationtime_ms?: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
