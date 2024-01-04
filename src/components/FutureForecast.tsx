import { useContext, useId } from "react";
import { LocationData } from "../App";
import { loadingImg } from "../services/types";
import moment from "moment";
moment.updateLocale("en", {
  calendar: {
    lastDay: " [Yesterday]",
    sameDay: " [Today]",
    nextDay: " [Tomorrow]",
    lastWeek: " [Last] dddd",
    nextWeek: " [Next] dddd",
    sameElse: "L",
  },
});

function FutureForecast() {
  const [locationData] = useContext(LocationData);
  return locationData ? (
    <div className="future-forecast block container">
      <p className="heading">FUTURE FORECAST</p>
      <div>
        {locationData.forecast.forecastday.map((forecast, index) => {
          if (index === 0) return undefined;
          return (
            <FutureForecastItem
              time={new Date(forecast.date)}
              label={forecast.day.condition.text}
              image={forecast.day.condition.icon}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <img src={loadingImg} alt="" />
  );
}

function FutureForecastItem({
  time,
  // temperature,
  image,
  label,
}: {
  time: Date;
  // temperature: string;
  image: string;
  label: string;
}) {
  const day_of_week = time.toLocaleDateString("en-US", { weekday: "long" });
  const today = moment(time);
  const relative_day = today.fromNow();
  return (
    <div className="future-forecast-item">
      <div className="day">
        {day_of_week}({relative_day})
      </div>
      <div className="weather">
        <img className="icon" src={image} title="forecast image" alt="" />
      </div>
      <span className="label">{label}</span>
      {/* <span className="temperature">{temperature}</span> */}
    </div>
  );
}
export default FutureForecast;
