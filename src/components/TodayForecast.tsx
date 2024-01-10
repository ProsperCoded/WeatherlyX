import { useContext, useEffect, useId, useState } from "react";
import { FORECAST_LOCATION_OBJECT, WEATHER_UNIT } from "../services/types";
import { LocationData, WeatherUnitContext } from "../App";

import { formatDate } from "../services/general";

function TodayForecast() {
  const [todayForecast, setTodayForecast] =
    useState<FORECAST_LOCATION_OBJECT>();
  const [locationData, setLocationData, skeletonClass] =
    useContext(LocationData);
  const [weatherUnit] = useContext(WeatherUnitContext);

  useEffect(() => {
    if (locationData) {
    }
  }, [locationData]);
  useEffect(() => {
    console.log("today forecast", todayForecast);
  });

  return (
    <div className="block container today-forecast ">
      <p className="heading">TODAY'S FORECAST</p>
      <div>
        {locationData?.forecast.forecastday[0].hour.map((forecast) => {
          return (
            <ForecastItem
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
        {!locationData &&
          ["", "", "", "", ""].map((e) => {
            return (
              <div className="forecast-item">
                <div>
                  <img
                    alt=""
                    className={skeletonClass + " forecast-item__image"}
                  />
                  <div className={skeletonClass + " forecast-item__time"}></div>
                </div>
                <h2
                  className={skeletonClass + " forecast-item__temperature"}
                ></h2>
              </div>
            );
          })}
      </div>
    </div>
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
