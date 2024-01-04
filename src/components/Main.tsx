import React, { useContext, useEffect, useRef, useState, useId } from "react";
// import weather_conditions from "./../weather_conditions.csv";
import {
  ICON_PROPERTIES,
  LocationData,
  ModeContext,
  UserLocationContext,
  WeatherUnitContext,
  forecast_days,
} from "../App";
import {
  fetchCityData,
  fetchCityDataById,
  fetchForecastData,
  fetchForecastDataById,
  fetchQuerySearch,
} from "../services/APIServices";
import {
  LOCATION_OBJECT,
  MODE,
  SEARCH_RESULT,
  WEATHER_UNIT,
  iconImageContext,
  loadingImg,
} from "../services/types";
import { formatDate, joinTimePartitions, spaceOut } from "../services/general";
import { log } from "../services/general";
import codeMap from "./../main-icons-map.json";
import timeIcon from "./../static/images/clock-fill.svg";

function getWeatherImageName(code: number, is_day: number) {
  const icon = ICON_PROPERTIES.find((row) => {
    return parseInt(row[0]) === code;
  });
  console.log(code, icon, codeMap);
  const options = is_day ? codeMap["day"] : codeMap["night"];
  for (const key in options) {
    if ((options[key] as number[]).includes(parseInt(icon![3]))) {
      return key;
    }
  }
}

function Main() {
  const [locationData, setLocationData] = useContext(LocationData);
  const userLocation = useContext(UserLocationContext);
  let [date, setDate] = useState<Date>();
  let [weatherUnit] = useContext(WeatherUnitContext!);

  const [mode, setMode] = useContext(ModeContext);
  const mainRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (userLocation.value) {
      fetchForecastData(userLocation.value, 7).then((response) => {
        setLocationData(response);
        // console.log("location Object", locationObject);
      });
    }
  }, [userLocation.value]);

  useEffect(() => {
    if (locationData && mainRef.current) {
      console.log("location data, ", locationData);
      setDate(new Date(locationData?.location.localtime!));
      const key = getWeatherImageName(
        locationData?.current.condition.code,
        locationData?.current.is_day
      );
      if (key) {
        console.log("key is ", key);
        const part_url = locationData.current.is_day
          ? "day/" + key + ".png"
          : "night/" + key + ".png";

        const image = `/static/icons/${key}.png`;
        mainRef.current.style.backgroundImage = `url(${iconImageContext(
          `./${key}.png`
        )})`;
      }
    }
  }, [locationData]);
  return (
    <div className="main container" ref={mainRef}>
      <div
        className="mode"
        onClick={() => {
          setMode((prevState) => {
            return prevState === MODE.CurrentCity
              ? MODE.Search
              : MODE.CurrentCity;
          });
        }}
      >
        <span className="label">Mode :</span>
        <span className="value">
          {mode} of {locationData?.location.name}
        </span>
        <div className="info">
          {mode === MODE.CurrentCity
            ? 'Click here or press "S" box to See Search Weather'
            : "Click here or press Esc to see Current City Weather"}
        </div>
      </div>
      <Search mainRef={mainRef} />
      <div className=" weather">
        <div className="weather-container">
          {locationData?.location ? (
            <span>
              <h4 className="weather__city">{locationData?.location.name}</h4>
              <p className="weather__country">
                ({locationData?.location.country})
              </p>
            </span>
          ) : (
            <img src={loadingImg} alt="" />
          )}
          {!locationData?.location && mode === MODE.Search && (
            <h3>You haven't made any Search</h3>
          )}
          <h5 className="weather__description">
            {locationData?.current.condition.text}
          </h5>
          <h3 className="weather__value">
            {locationData?.current.temp_c &&
              (weatherUnit === WEATHER_UNIT.Celsius
                ? locationData?.current.temp_c + weatherUnit
                : locationData?.current.temp_f + weatherUnit!)}
          </h3>
        </div>
        <div>
          <Theme />
          <ChangeLocation />
          <span className="weather__time">
            {locationData ? (
              <>
                <img src={timeIcon} alt="" />
                {date && formatDate(date, true)}
              </>
            ) : (
              <img src={loadingImg} alt="" />
            )}
          </span>
          <WeatherUnitToggler />
        </div>
      </div>
    </div>
  );
}

function Search({
  mainRef,
}: {
  mainRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [mode, setMode] = useContext(ModeContext);
  const [showSearchResults, setShowSearchResults] = useState<Boolean>(false);
  const searchContainer = useRef<HTMLOListElement | null>(null);
  // const searchResultsContainer = useRef()
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SEARCH_RESULT[]>([]);
  const [locationData, setLocationData] = useContext(LocationData);

  useEffect(() => {
    mainRef.current!.addEventListener!("focusout", (e) => {
      console.log("focus out event is,", e.relatedTarget as HTMLOListElement);
      // e.stopPropagation();
      if (
        e.relatedTarget &&
        !(e.relatedTarget as HTMLOListElement).classList.contains(
          "search__result"
        )
      ) {
        setShowSearchResults(false);
      } else if (!e.relatedTarget) {
        setShowSearchResults(false);
      }
    });
  }, []);
  const getResults = (q: string) => {
    fetchQuerySearch(q).then((results_) => {
      setResults(results_);
    });
  };
  const getResultLocationData = (q: SEARCH_RESULT) => {
    fetchForecastDataById(q.id, forecast_days).then((result_) => {
      log(false, "results from click", result_);
      setLocationData(result_);
    });
  };
  return (
    <div className="search-container" tabIndex={0}>
      <input
        type="text"
        placeholder="Search For Cities..."
        className="search"
        onClick={() => {
          setMode(MODE.Search);
          setShowSearchResults(true);
        }}
        value={query}
        onChange={(e) => {
          setShowSearchResults(true);
          if (e.target.value) {
            setQuery(e.target.value);
            getResults(e.target.value.trim());
          } else {
            setQuery(e.target.value);
            setResults([]);
          }
        }}
      />
      <ul
        className="search__results"
        style={{
          height: showSearchResults ? "70%" : "0px",
          padding: showSearchResults ? "0.5em 2em 1em 2em" : "0",
        }}
        onClick={(e) => {
          console.log("clicked on an item in the list");
          e.stopPropagation();
        }}
        ref={searchContainer}
        tabIndex={1}
      >
        {results.map((result) => {
          return (
            <li
              className="search__result"
              tabIndex={2}
              onClick={(e) => {
                console.log("clicked on a result:", result);
                getResultLocationData(result);
                setTimeout(() => {
                  setShowSearchResults(false);
                }, 500);
              }}
            >
              Weather of :<span className="name">{spaceOut(result.name)}</span>
              in the <span className="region">
                {spaceOut(result.region)}
              </span>{" "}
              region, in{" "}
              <span className="country">{spaceOut(result.country)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Theme(props: Object) {
  return (
    <div className="theme">
      <button className="theme__toggler"></button>
      <span className="theme__name">Dark</span>
    </div>
  );
}

function WeatherUnitToggler() {
  const [weatherUnit, setWeatherUnit] = useContext(WeatherUnitContext);
  const toggleWeatherUnit = () => {
    setWeatherUnit!((prevState) => {
      const unit =
        prevState == WEATHER_UNIT.Celsius
          ? WEATHER_UNIT.Fahrenheit
          : WEATHER_UNIT.Celsius;
      return unit;
    });
  };
  return (
    <div className="weather-unit">
      <div
        className="weather-unit__toggler-container"
        onClick={toggleWeatherUnit}
      >
        <div
          className="weather-unit__toggler"
          style={
            weatherUnit === WEATHER_UNIT.Celsius ? { left: 0 } : { right: 0 }
          }
        ></div>
      </div>
    </div>
  );
}
function ChangeLocation() {
  const locationObject = useContext(UserLocationContext);

  return (
    <div
      className="change-location"
      onClick={() => {
        locationObject.promptForUserLocation();
      }}
    >
      Change location
    </div>
  );
}
export default Main;
