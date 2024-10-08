// INFO manually typed

export const CurrentGeoOption = {
  temperature_2m: "temperature_2m",
  relative_humidity_2m: "relative_humidity_2m",
  wind_speed_10m: "wind_speed_10m",
  wind_direction_10m: "wind_direction_10m",
  is_day: "is_day",
} as const;
export type CurrentGeoOption =
  (typeof CurrentGeoOption)[keyof typeof CurrentGeoOption];

export const DailyGeoOption = {
  ApparentTemperatureMax: "apparent_temperature_max",
  ApparentTemperatureMin: "apparent_temperature_min",
  Temperature2mMax: "temperature_2m_max",
  Temperature2mMin: "temperature_2m_min",
} as const;
export type DailyGeoOption =
  (typeof DailyGeoOption)[keyof typeof DailyGeoOption];

export const HourlyGeoOption = {
  Temperature2m: "temperature_2m",
  RelativeHumidity2m: "relative_humidity_2m",
} as const;
export type HourlyGeoOption =
  (typeof HourlyGeoOption)[keyof typeof HourlyGeoOption];

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

export interface GeoSearchResponse {
  generationtime_ms: number;
  results: Array<GeoSearchItem>;
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
  [key: string]: number | string;
}

export interface ForecastGetDaily {
  [key: string]: Array<number | string>;
}

export interface ForecastGetHourlyUnits {
  [key: string]: number | string;
}

export interface ForecastGetHourly {
  [key: string]: Array<number | string>;
}

export interface ForecastGetResponse {
  current?: ForecastGetCurrent;
  current_units?: ForecastGetCurrentUnits;
  daily?: ForecastGetDaily;
  daily_units?: ForecastGetDailyUnits;
  hourly?: ForecastGetHourly;
  hourly_units?: ForecastGetHourlyUnits;
  elevation?: number;
  generationtime_ms?: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
