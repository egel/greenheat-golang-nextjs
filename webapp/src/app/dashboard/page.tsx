"use client";

import Footer from "@/components/footer";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  first,
  switchMap,
  tap,
} from "rxjs";
import Link from "next/link";
import { Optional, Nullable } from "@/lib/interfaces/standard";
import { ApiService } from "@/lib/api/api-service";
import { APP_ROUTES } from "@/constans/appRouter";
import {
  CurrentGeoOption,
  DailyGeoOption,
  ForecastGetQueryParams,
  ForecastGetResponse,
  GeoSearchItem,
  HourlyGeoOption,
} from "@/lib/api/openmeteo-dtos";
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  registerables,
} from "chart.js";
import { MdClose, MdSearch } from "react-icons/md";
import { ImSpinner } from "react-icons/im";
Chart.register(...registerables); // INFO: important to initialize graphs

import image2 from "../../public/undraw_searching_re_3ra9.svg";

function chartDataReset() {
  return {
    labels: [],
    datasets: [],
  };
}

export default function Dashboard() {
  const apiService = useMemo(() => new ApiService(), []);

  const searchTownInput = useRef(null);
  const [searchTownInputFocused, setSearchTownInputFocused] = useState(false);
  const onFocus = () => setSearchTownInputFocused(true);
  const onBlur = () => setSearchTownInputFocused(false);

  const canvasHourlyGraphRef = useRef<HTMLCanvasElement>(null);
  const chartHourlyRef = useRef<Nullable<Chart>>();
  const canvasDailyGraphRef = useRef<HTMLCanvasElement>(null);
  const chartDailyRef = useRef<Nullable<Chart>>();

  const destroyHourlyChart = () => {
    if (chartHourlyRef.current) {
      chartHourlyRef.current.clear();
      chartHourlyRef.current.destroy();
      chartHourlyRef.current = null;
    }
  };

  const destroyDailyChart = () => {
    if (chartDailyRef.current) {
      chartDailyRef.current.clear();
      chartDailyRef.current.destroy();
      chartDailyRef.current = null;
    }
  };

  const [chartHourlyData, setChartHourlyData] =
    useState<ChartData<"line">>(chartDataReset());
  const [chartHourlyOptions, setChartHourlyOptions] = useState<ChartOptions>();
  const [chartDailyData, setChartDailyData] =
    useState<ChartData<"line">>(chartDataReset());
  const [chartDailyOptions, setChartDailyOptions] = useState<ChartOptions>();

  const renderHourlyChart = () => {
    if (!canvasHourlyGraphRef.current) {
      return;
    }

    chartHourlyRef.current = new Chart(canvasHourlyGraphRef.current, {
      type: "line",
      data: chartHourlyData,
      options: chartHourlyOptions,
    });
  };

  const renderDailyChart = () => {
    if (!canvasDailyGraphRef.current) {
      return;
    }

    chartDailyRef.current = new Chart(canvasDailyGraphRef.current, {
      type: "line",
      data: chartDailyData,
      options: chartDailyOptions,
    });
  };

  // rerender when data changes
  useEffect(() => {
    renderHourlyChart();

    return () => destroyHourlyChart();
  }, [chartHourlyOptions, chartHourlyData]);

  // rerender when data changes
  useEffect(() => {
    renderDailyChart();

    return () => destroyDailyChart();
  }, [chartDailyOptions, chartDailyData]);

  const [isListHovered, setIsListHovered] = useState(false);

  const searchTown$: BehaviorSubject<string> = new BehaviorSubject("");

  const [isContentLoading, setIsContentLoading] = useState<boolean>(true);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [forecastData, setForecastData] =
    useState<Optional<ForecastGetResponse>>(void 0);
  const [geosearchData, setGeosearchData] = useState([]);
  const [searchTown, setSearchTown] = useState("");
  const [searchTownSelected, setSearchTownSelected] =
    useState<Optional<GeoSearchItem>>(void 0);
  const searchTownChange = (v: any) => {
    setSearchTown(v);
    searchTown$.next(v);
  };

  const searchTownInputReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSearchTown("");
    setSearchTownSelected(void 0);
  };

  const searchTownListOnClickHander = (
    e: MouseEvent<HTMLAnchorElement>,
    item: GeoSearchItem,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setSearchTownSelected(item);
    setSearchTownInputFocused(false);
    setIsListHovered(false);
  };

  const displayFullSearchTownName = (item: Optional<GeoSearchItem>) => {
    if (!item) return "";
    let name = "";
    if (item.name) name += `${item.name}, `;
    if (item.admin1) name += `${item.admin1}, `;
    if (item.admin2) name += `${item.admin2}, `;
    if (item.admin3) name += `${item.admin3}, `;
    if (item.admin4) name += `${item.admin4}, `;
    if (item.country) name += `${item.country}, `;
    return name.substring(0, name.length - 2);
  };

  const displayPopulation = (item: Optional<GeoSearchItem>) => {
    return item?.population ? item.population : "-";
  };

  const displayDayOrNight = (isDay: Optional<boolean | number | string>) => {
    if (isDay === undefined) return "-";
    return isDay == "true" || isDay == "1" || isDay === 1 ? "day" : "night";
  };

  // rendering list of geolocations
  const searchTownListRender = (list: Array<GeoSearchItem>) => {
    const result = list.map((item) => {
      return (
        <a
          className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-100 hover:bg-purple-100 dark:hover:bg-purple-800 min-w-full cursor-pointer"
          role="menuitem"
          tabIndex={-1}
          id={`geosearch-${item.id}`}
          key={item.id}
          onClick={(e) => searchTownListOnClickHander(e, item)}
        >
          {displayFullSearchTownName(item)}
        </a>
      );
    });
    return result.length ? result : <p>No entries found</p>;
  };

  // find desired geolocation
  useEffect(() => {
    if (searchTown.length === 0) {
      setIsSearchLoading(false);
      return;
    }
    const subscription = combineLatest([searchTown$.pipe(debounceTime(300))])
      .pipe(
        tap(() => {
          setIsSearchLoading(true);
        }),
        switchMap(() => apiService.geosearchGet$(searchTown)),
        first(),
      )
      .subscribe({
        next: (res: any) => {
          console.log("geosearch", res.results);
          setIsContentLoading(false);
          setGeosearchData(res.results);
          setSearchTownInputFocused(true);
          setIsSearchLoading(false);
        },
        error: (err) => {
          console.error(err);
          setIsContentLoading(false);
          setIsSearchLoading(false);
        },
      });
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [searchTown]);

  const generateChartLineHourlyData = (forecast: ForecastGetResponse) => {
    let res: ChartData<"line"> = chartDataReset();
    res.labels = forecast.hourly?.time;

    const hourlyGraphs = Object.values(HourlyGeoOption);
    hourlyGraphs.forEach((name) => {
      res.datasets.push({
        label: name,
        data: forecast.hourly?.[name],
        fill: false,
      } as ChartDataset<"line">);
    });

    return res;
  };

  const generateChartLineDailyData = (forecast: ForecastGetResponse) => {
    let res: ChartData<"line"> = chartDataReset() as never;
    res.labels = forecast.daily?.time;

    const dailyGraphs = Object.values(DailyGeoOption);
    dailyGraphs.forEach((name) => {
      res.datasets.push({
        label: name,
        data: forecast.daily?.[name],
        fill: false,
      } as ChartDataset<"line">);
    });

    return res;
  };

  // get forecast information
  useEffect(() => {
    if (!searchTownSelected) return;
    const params: ForecastGetQueryParams = {
      latitude: searchTownSelected.latitude,
      longitude: searchTownSelected.longitude,
      current: Object.values(CurrentGeoOption).join(","),
      hourly: Object.values(HourlyGeoOption).join(","),
      daily: Object.values(DailyGeoOption).join(","),
    };
    const subscription = apiService
      .forecastGet$(params)
      .pipe(debounceTime(300), first())
      .subscribe({
        next: (res: any) => {
          console.log(res);
          setForecastData(res);
          setChartDailyData(generateChartLineDailyData(res));
          setChartHourlyData(generateChartLineHourlyData(res));
        },
        error: (err) => {
          console.error(err);
        },
      });
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [searchTownSelected]);

  return (
    <div className="overflow-hidden flex flex-col h-full">
      <nav className="px-4 pb-5 pt-7 border-zinc-200 bg-purple-500 dark:bg-purple-900 dark:border-purple-200">
        <div className="mx-auto flex items-center justify-between px-2 sm:px-4 lg:max-w-7xl">
          <div className="flex items-center justify-start">
            <h1 className="text-2xl text-zinc-50 dark:text-zinc-80">
              GreenHeat
            </h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 text-zinc-100">
            <Link href={APP_ROUTES.DASHBOARD}>Dashboard</Link>
          </div>
        </div>
      </nav>
      <main className="px-4 mt-4 flex-1 overflow-y-auto">
        <div className="relative mx-auto lg:max-w-7xl">
          <form className="bg-white dark:border-zinc-700 dark:bg-zinc-900 border dark:border-stone-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="relative mb-1">
              <label
                className="block text-zinc-700 dark:text-zinc-100 text-sm font-bold mb-2"
                htmlFor="geosearch"
              >
                Search for desired place
              </label>
              <div className="relative">
                <MdSearch className="absolute size-6 top-2 left-2" />
                <input
                  ref={searchTownInput}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="pl-10 shadow appearance-none border dark:border-stone-700 hover:border-stone-500 rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-100 bg-white dark:bg-neutral-800 leading-tight focus:outline-none focus:shadow-outline"
                  id="geosearch"
                  type="text"
                  placeholder="e.g.: New York"
                  value={searchTown}
                  onChange={(event) => searchTownChange(event.target.value)}
                />
                <div className="absolute top-2 right-2 flex flex-row align-center">
                  {isSearchLoading ? (
                    <ImSpinner className="animate-spin size-5" />
                  ) : (
                    ""
                  )}
                  <button onClick={searchTownInputReset}>
                    <MdClose className="size-6" />
                  </button>
                </div>
              </div>
              {geosearchData &&
              geosearchData.length > 0 &&
              (searchTownInputFocused || isListHovered) ? (
                <div
                  className="absolute left-0 z-10 mt-2 flex overflow-y-auto origin-top-right rounded-md bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                  onMouseEnter={() => setIsListHovered(true)}
                  onMouseLeave={() => setIsListHovered(false)}
                >
                  <div
                    className="my-2 w-65 flex flex-col max-w-140 max-h-64 min-h-10"
                    role="none"
                  >
                    {searchTownListRender(geosearchData)}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </form>
          {!isContentLoading && searchTownSelected ? (
            <div className="ease-in-out duration-300">
              <div className="grid gap-4 my-4 xl:grid-cols-2 2xl:grid-cols-3">
                <div className="p-4 bg-white border border-zinc-200 rounded-lg 2xl:col-span-2 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-2xl text-purple-600">
                    Geo Search details
                  </h2>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Name</div>
                    <div>{displayFullSearchTownName(searchTownSelected)}</div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Coordinates</div>
                    <div>
                      {searchTownSelected?.latitude} °N,{" "}
                      {searchTownSelected?.longitude} °E
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Population</div>
                    <div>{displayPopulation(searchTownSelected)}</div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Time Zone</div>
                    <div>{searchTownSelected?.timezone}</div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-zinc-200 rounded-lg shadow-sm 2xl:col-span-1 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-2xl text-purple-600">
                    Current data
                  </h2>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Is Day</div>
                    <div>
                      {displayDayOrNight(forecastData?.current?.is_day)}
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Time</div>
                    <div>{forecastData?.current?.time}</div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Temperature 2m</div>
                    <div>
                      {forecastData?.current?.temperature_2m}{" "}
                      {forecastData?.current_units?.temperature_2m}
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <div className="font-bold">Relative humidity (2m)</div>
                    <div>
                      {forecastData?.current?.relative_humidity_2m}{" "}
                      {forecastData?.current_units?.relative_humidity_2m}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 my-4 xl:grid-cols-2 xl:gap-4">
                <div className="p-4 mb-4 bg-white border border-zinc-200 rounded-lg shadow-sm sm:p-6 xl:mb-0 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-2xl text-purple-600">Daily info</h2>
                  <canvas
                    ref={canvasDailyGraphRef}
                    role="img"
                    height={300}
                    width={500}
                  ></canvas>
                </div>
                <div className="p-4 bg-white border border-zinc-200 rounded-lg shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-2xl text-purple-600">Hourly info</h2>
                  <canvas
                    ref={canvasHourlyGraphRef}
                    role="img"
                    height={300}
                    width={500}
                  ></canvas>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-20 flex flex-row justify-center content-center">
              <Image
                alt=""
                src="/undraw_searching_re_3ra9_v1.svg"
                height="200"
                width="200"
              />
              <div className="flex flex-col justify-center ">
                <h1 className="mb-2 text-3xl text-purple-600 dark:text-purple-500">
                  Pick your place
                </h1>
                <p>Search for desired place to find meteo information.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
