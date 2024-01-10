import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/index.scss";
import Main from "./components/Main";
import Conditions from "./components/Conditions";
import TodayForecast from "./components/TodayForecast";
import FutureForecast from "./components/FutureForecast";
import alertAdvance from "sweetalert2";
import {
  FORECAST_LOCATION_OBJECT,
  LOCATION_OBJECT,
  MODE,
  WEATHER_UNIT,
} from "./services/types";
import weather_conditions from "./weather_conditions.csv";
import Papa from "papaparse";

function useGetLocation() {
  const [value, setValue] = useState("");
  function promptForUserLocation() {
    alertAdvance
      .fire({
        title: "Type in your location",
        input: "text",
        icon: "question",
        // value,
        inputAttributes: {
          // value: value,
          placeholder: "Type in your location",
        },
        didOpen: () => {
          // console.log(alertAdvance.getInput());
          // console.log(alertAdvance.getPopup());
        },
      })
      .then((result) => {
        if (result.value && result.isConfirmed) {
          setValue(result.value);
          storeLocation(result.value);
        }
      });
  }
  function getLocationFromStorage() {
    return localStorage.getItem("location");
  }
  function storeLocation(location: string) {
    localStorage.setItem("location", location);
  }
  useEffect(() => {
    const location = getLocationFromStorage();
    if (location) {
      setValue(location);
    } else {
      promptForUserLocation();
    }
  }, []);
  return { value, promptForUserLocation };
}
export let ICON_PROPERTIES: string[][];
Papa.parse(weather_conditions, {
  complete: (results, file) => {
    ICON_PROPERTIES = results.data as string[][];
  },
  download: true,
  // step: (row) => {
  //   console.log("row of each", row);
  //   return row;
  // },
});

export const UserLocationContext = React.createContext({
  value: "",
  promptForUserLocation: () => {},
});

export const WeatherUnitContext = React.createContext<
  [WEATHER_UNIT, React.Dispatch<React.SetStateAction<WEATHER_UNIT>>]
>([WEATHER_UNIT.Celsius, () => {}]);
export const ModeContext = React.createContext<
  [MODE, React.Dispatch<React.SetStateAction<MODE>>]
>([MODE.CurrentCity, () => {}]);
export const LocationData = React.createContext<
  [
    FORECAST_LOCATION_OBJECT | undefined,
    React.Dispatch<React.SetStateAction<FORECAST_LOCATION_OBJECT | undefined>>,
    string
  ]
>([undefined, () => {}, ""]);
export const forecast_days = 7;
function App() {
  const userLocation = useGetLocation();
  const [currentLocationData, setCurrentLocationData] =
    useState<FORECAST_LOCATION_OBJECT>();
  const [searchLocationData, setSearchLocationData] =
    useState<FORECAST_LOCATION_OBJECT>();

  const [weatherUnit, setWeatherUnit] = useState<WEATHER_UNIT>(
    WEATHER_UNIT.Celsius
  );
  const [mode, setMode] = useState<MODE>(MODE.CurrentCity);
  const contentRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   if (contentRef.current) {
  //     contentRef.current.addEventListener("keydown", (e) => {
  //       console.log("pressed", e.code);
  //       setMode(MODE.CurrentCity);
  //     });
  //   }
  // }, []);
  return (
    <LocationData.Provider
      value={
        mode === MODE.CurrentCity
          ? [
              currentLocationData,
              setCurrentLocationData,
              currentLocationData ? "" : " skeleton ",
            ]
          : [
              searchLocationData,
              setSearchLocationData,
              searchLocationData ? "" : " skeleton ",
            ]
      }
    >
      <ModeContext.Provider value={[mode, setMode]}>
        <WeatherUnitContext.Provider value={[weatherUnit, setWeatherUnit]}>
          <UserLocationContext.Provider value={userLocation}>
            <div
              className="App"
              onKeyDown={(e) => {
                console.log(e.code);
                if (e.code === "Escape") {
                  setMode(MODE.CurrentCity);
                } else if (e.code === "KeyS") {
                  setMode(MODE.Search);
                }
              }}
              tabIndex={1}
            >
              <div className="content" ref={contentRef}>
                <Main />
                <Conditions />
                <TodayForecast />
                <FutureForecast />
              </div>
            </div>
          </UserLocationContext.Provider>
        </WeatherUnitContext.Provider>
      </ModeContext.Provider>
    </LocationData.Provider>
  );
}

export default App;
