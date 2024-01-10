import { useContext, useEffect, useRef, useState } from "react";
import { LocationData, UserLocationContext } from "../App";
import DewPointImage from "./../static/images/conditions/dew-point.svg";
import gust_wind_image from "./../static/images/conditions/gust-wind.svg";
import windDirectionImage from "./../static/images/conditions/compass.svg";
import forwardImage from "./../static/images/conditions/forward.svg";
import arrow from "./../static/images/conditions/arrow.svg";

function Conditions() {
  const userLocation = useContext(UserLocationContext);
  const [locationData] = useContext(LocationData);
  return (
    <div className="container block conditions " style={{ zIndex: 2 }}>
      <p className="heading">ALL CONDITIONS</p>
      <div className="grid-1x3 conditions-container">
        <DewPointCondition />
        <GustWind />
        <WindDirection />
      </div>
      <div>
        <MoreOptions />
      </div>
    </div>
  );
}
function MoreOptions() {
  const [locationData, setLocationData, skeletonClass] =
    useContext(LocationData);
  const [open, setOpen] = useState<Boolean>(false);
  return (
    <div className="more-details">
      <div className="more-details__toggler">More Details</div>
      <img
        src={forwardImage}
        alt=""
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        style={{ transform: open ? "rotateZ(90deg)" : "rotateZ(0deg)" }}
      />
      <ul
        className="more-details__items"
        style={{
          maxHeight: open ? "100vw" : "0",
          padding: open ? "1em" : "0",
        }}
      >
        <li className="more-details__item grid-1x2">
          <span className="label">Cloud Cover :</span>{" "}
          <span className={skeletonClass + "value"}>
            {locationData?.current.cloud.toString()}%
          </span>
        </li>
        <li className="more-details__item grid-2x2">
          <span className="label">Visibility :</span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.vis_km.toString()} km
          </span>
          <span className="value">
            {locationData?.current.vis_miles.toString()} miles
          </span>
        </li>
        <li className="more-details__item grid-2x2">
          <span className="label">Precipitation :</span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.precip_mm.toString()} per mm
          </span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.precip_in.toString()} per Inch
          </span>
        </li>
        <li className="more-details__item grid-2x2">
          <span className="label">Pressure :</span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.pressure_mb.toString()} millibars
          </span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.pressure_in.toString()} Inch of mercury
          </span>
        </li>
        <li className="more-details__item grid-1x2">
          <span className="label">CO in air:</span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.air_quality.co} µg/m³
          </span>
        </li>
        <li className="more-details__item grid-1x2">
          <span className="label">
            NO<sub>2</sub> in air:
          </span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.air_quality.no2} µg/m³
          </span>
        </li>
        <li className="more-details__item grid-1x2">
          <span className="label">
            O<sub>3</sub> in air:
          </span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.air_quality.o3} µg/m³
          </span>
        </li>
        <li className="more-details__item grid-1x2">
          <span className="label">
            SO<sub>2</sub> in air:
          </span>
          <span className={skeletonClass + "value"}>
            {locationData?.current.air_quality.so2} µg/m³
          </span>
        </li>
      </ul>
    </div>
  );
}
function DewPointCondition() {
  const [locationData, setLocationData, skeletonClass] =
    useContext(LocationData);

  return (
    <div className="condition__dew-point condition">
      <img src={DewPointImage} alt="" className="condition__image" />
      <div>
        <div className="label">Dew Point </div>
        <div className={skeletonClass + "value"}>
          {locationData && locationData.current.humidity + "%"}
        </div>
      </div>
    </div>
  );
}

function GustWind() {
  const [locationData, setLocationData, skeletonClass] =
    useContext(LocationData);
  return (
    <div className="condition__gust-wind condition">
      <img src={gust_wind_image} alt="" className="condition__image" />
      <div>
        <div className="label">Gust / Wind</div>
        <div className="value grid-2x1">
          <span className={skeletonClass + "km-hr"}>
            {locationData &&
              locationData.current.gust_kph +
                "/" +
                locationData.current.wind_kph}
          </span>

          <span className={skeletonClass + "m-h"}>
            {locationData &&
              locationData.current.gust_mph +
                "/" +
                locationData.current.wind_mph}
          </span>
        </div>
      </div>
    </div>
  );
}

function WindDirection() {
  const compass = useRef<HTMLImageElement | null>(null);
  const [locationData] = useContext(LocationData);
  useEffect(() => {
    if (compass.current && locationData?.current) {
      compass.current.style.transform = `rotateZ(${locationData?.current.wind_degree}deg)`;
    }
  }, [locationData]);
  return (
    <div className="condition__wind-direction condition">
      {locationData && (
        <span className="condition__compass-label">
          ({locationData?.current.wind_dir} {locationData?.current.wind_degree}
          °)
        </span>
      )}
      <div>
        <img src={windDirectionImage} alt="" className="condition__image" />
        {locationData && (
          <div className="compass-arrow-container">
            <img
              src={arrow}
              alt=""
              className="condition__compass-arrow"
              ref={compass}
            />
          </div>
        )}
      </div>
      <div>
        <div className="label"> Wind Direction</div>
      </div>
    </div>
  );
}
export default Conditions;
