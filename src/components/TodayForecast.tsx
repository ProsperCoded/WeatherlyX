import { useContext, useEffect, useId, useState } from "react";
import {
  FORECAST_LOCATION_OBJECT,
  WEATHER_UNIT,
  loadingImg,
} from "../services/types";
import { LocationData, WeatherUnitContext } from "../App";
import {
  fetchForecastDataById,
  fetchQuerySearch,
} from "../services/APIServices";
import { formatDate } from "../services/general";

function TodayForecast() {
  const [todayForecast, setTodayForecast] =
    useState<FORECAST_LOCATION_OBJECT>();
  const [locationData] = useContext(LocationData);
  const [weatherUnit] = useContext(WeatherUnitContext);
  const getTodayForecast = async () => {
    const searchResult = await fetchQuerySearch(locationData!.location.name!);
    const result = searchResult.find((e) => {
      return e.name === locationData?.location.name;
    });
    if (result) {
      const forecastData = await fetchForecastDataById(result.id, 1);
      setTodayForecast(forecastData);
    } else {
      console.log("can't find match for ", locationData?.location.name);
    }
  };
  useEffect(() => {
    // fetchForecastData(locationData?.location)
    if (locationData) {
      // const searchResult = fetchQuerySearch(locationData.location.name!);
    }
  }, [locationData]);
  useEffect(() => {
    console.log("today forecast", todayForecast);
  });

  return locationData ? (
    <div className="block container today-forecast">
      <p className="heading">TODAY'S FORECAST</p>
      <div>
        {locationData.forecast.forecastday[0].hour.map((forecast) => {
          return (
            <ForecastItem
              // key={useId()}
              temperature={
                weatherUnit === WEATHER_UNIT.Celsius
                  ? `${forecast.temp_c}°C`
                  : `${forecast.temp_f}°F`
              }
              time={new Date(forecast.time)}
              image={forecast.condition.icon}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <img src={loadingImg} alt="" />
  );
}
function ForecastItem({
  time,
  temperature,
  image,
}: {
  time: Date;
  temperature: string;
  image: string;
}) {
  return (
    <div className="forecast-item">
      <div>
        <img src={image} alt="" className="forecast-item__image" />
        <div className="forecast-item__time">{formatDate(time, true)}</div>
      </div>
      <h2 className="forecast-item__temperature">{temperature}</h2>
    </div>
  );
}
export default TodayForecast;
