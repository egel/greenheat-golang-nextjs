import { Observable, switchMap, catchError, throwError, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { ForecastGetQueryParams, GeoSearchItem } from "./openmeteo-dtos";
import { Optional } from "../interfaces/standard";

type SuccessCallback = () => void;
type ErrorCallback = () => void;

interface IApiService {
  geosearchGet$: (
    name: string,
    successCallback?: SuccessCallback,
    errorCallback?: ErrorCallback,
  ) => void;

  forecastGet$: (
    queryParams: ForecastGetQueryParams,
    successCallback?: SuccessCallback,
    errorCallback?: ErrorCallback,
  ) => void;
}

export class ApiService implements IApiService {
  /**
   * Pay attention!
   *
   * next.config.js redirects all /api/* to the address of backend server
   * for convenience of local development.
   *
   * Server API starts with `/v1`
   * NextJS dev server redirect all requests that starts with `/api/*` and
   * rewrites them to `http://<HOST>:<PORT>/v1`
   *
   * @example
   * Route `/api/v1/openmeteo/forecast` will be redirect to
   * `http://localhost:8000/v1/openmeteo/forecast`
   */
  static readonly BaseURL = "/api/v1";
  static readonly DefaultHeaders = {
    "Content-Type": "application/json",
    Charset: "utf-8",
  };
  static readonly DefaultFromFetchInit: RequestInit = {
    headers: ApiService.DefaultHeaders,
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  public geosearchGet$(name: string = ""): Observable<any> {
    const extendInit: RequestInit = {
      ...ApiService.DefaultFromFetchInit,
      method: "GET",
    };

    let url = `${ApiService.BaseURL}/openmeteo/geosearch`;
    if (name.length > 0) {
      url += `?name=${name}`;
    }

    return fromFetch(url, extendInit).pipe(
      switchMap((response: Response) => {
        if (!response.ok || response.status >= 400) {
          // Server is returning a status requiring the client to try something else.
          console.error(response);
          return throwError(() => response);
        }
        return response.json();
      }),
      catchError((err: Response) => {
        // Network or other error, handle appropriately
        console.error(err);
        return throwError(() => err);
      }),
    );
  }

  public forecastGet$(searchQuery: ForecastGetQueryParams): Observable<any> {
    const extendInit: RequestInit = {
      ...ApiService.DefaultFromFetchInit,
      method: "GET",
    };

    let queryParamsInline = "";
    if (searchQuery?.latitude)
      queryParamsInline += `latitude=${searchQuery.latitude}`;
    if (searchQuery?.longitude)
      queryParamsInline += `&longitude=${searchQuery.longitude}`;
    // current
    queryParamsInline += `&current=${searchQuery.current}`;
    // hourly
    queryParamsInline += `&hourly=${searchQuery.hourly}`;
    // daily
    queryParamsInline += `&daily=${searchQuery.daily}`;

    let url = `${ApiService.BaseURL}/openmeteo/forecast`;
    if (searchQuery && queryParamsInline.length > 0) {
      url += `?${queryParamsInline}`;
    }

    return fromFetch(url, extendInit).pipe(
      switchMap((response: Response) => {
        if (!response.ok || response.status >= 400) {
          // Server is returning a status requiring the client to try something else.
          console.error(response);
          return throwError(() => response);
        }
        return response.json();
      }),
      catchError((err: Response) => {
        // Network or other error, handle appropriately
        console.error(err);
        return throwError(() => err);
      }),
    );
  }
}
