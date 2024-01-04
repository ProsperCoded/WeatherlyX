// export type LOCATION_OBJECT = {
//   value: string;
//   promptForUserLocation: () => void;
// };

export type LOCATION_OBJECT = {
  condition: { text: string; icon: string; code: number };
  gust_kph: string;
  gust_mph: string;
  wind_kph: string;
  wind_mph: string;
  temp_c: string;
  temp_f: string;
  is_day: number;
  humidity: string;
  wind_degree: string;
  wind_dir: string;

  cloud: number; //cloud cover
  vis_km: number;
  vis_miles: number;
  precip_mm: number;
  precip_in: number;
  pressure_mb: number; //millibars
  pressure_in: number; //inches of mercury;
  air_quality: {
    co: string;
    no2: string;
    o3: string;
    so2: string;
  };
};
export interface FORECAST_LOCATION_OBJECT extends LOCATION_OBJECT {
  current: LOCATION_OBJECT;
  forecast: {
    forecastday: {
      hour: (LOCATION_OBJECT & { time: string })[];
      date: string;
      day: LOCATION_OBJECT;
    }[];
  };
  location: {
    country: string;
    name: string;
    region: string;
    localtime: string;
  };
}
export enum WEATHER_UNIT {
  Fahrenheit = "°F",
  Celsius = "°C",
}
export enum MODE {
  Search = "Data on Search",
  CurrentCity = "Data on Current City",
}
export type SEARCH_RESULT = {
  id: number;
  name: string;
  region: string;
  country: string;
};

export const loadingImg = require("./../static/images/loading.gif");
export const iconImageContext = require.context("./../static/icons", true);
