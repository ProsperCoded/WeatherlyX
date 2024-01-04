import { get } from "./general";
import {
  FORECAST_LOCATION_OBJECT,
  LOCATION_OBJECT,
  SEARCH_RESULT,
} from "./types";

const API_KEY = "16130baf0cb24c44b66143432232212";
const baseUrl = "https://api.weatherapi.com/";

export async function fetchCityData(value: string) {
  const url = new URL(
    `/v1/current.json?key=${API_KEY}&q=${value}&aqi=yes`,
    baseUrl
  );
  const response = await get(
    url,
    "Wasn't able to fetch data for current city: " + value
  );
  return response as LOCATION_OBJECT;
}
export async function fetchQuerySearch(q: string) {
  const url = new URL(`/v1/search.json?key=${API_KEY}&q=${q}&aqi=yes`, baseUrl);
  const response = await get(url, "Error Searching for :" + q);
  return response as SEARCH_RESULT[];
}
export async function fetchCityDataById(q: number) {
  const url = new URL(
    `/v1/current.json?key=${API_KEY}&q=id:${q}&aqi=yes`,
    baseUrl
  );
  const response = await get(url, "Error getting results for id:" + q);
  return response as LOCATION_OBJECT;
}
export async function fetchForecastDataById(q: number, no_days: number) {
  const url = new URL(
    `/v1/forecast.json?key=${API_KEY}&q=id:${q}&days=${no_days}&aqi=yes&alerts=no`,
    baseUrl
  );
  const response = await get(url, "Error getting forecast data for " + q);
  return response as FORECAST_LOCATION_OBJECT;
}
export async function fetchForecastData(q: string, no_days: number) {
  const url = new URL(
    `/v1/forecast.json?key=${API_KEY}&q=${q}&days=${no_days}&aqi=yes&alerts=no`,
    baseUrl
  );
  const response = await get(url, "Error getting forecast data for " + q);
  return response as FORECAST_LOCATION_OBJECT;
}
