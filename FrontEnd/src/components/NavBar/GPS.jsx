import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import IOSSwitch from "../../styles/IOSSwitch";
import { FormControlLabel, Switch, CircularProgress } from "@mui/material";
import {
  ReplayCircleFilledOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { setLocation, setLocationLongLat } from "../../store2/loginUser";

export default function GPS() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const initialSwitchValue = Cookies.get("address") ? true : false;
  const [isSwitchOn, setIsSwitchOn] = useState(initialSwitchValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchChange = () => {
    setIsSwitchOn((prev) => !prev);
    if (isSwitchOn) {
      turnOffGps();
    }
  };

  useEffect(() => {
    if (isSwitchOn) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        getAddress(position.coords.longitude, position.coords.latitude);
        dispatch(
          setLocationLongLat([
            position.coords.longitude,
            position.coords.latitude,
          ])
        );
        setIsLoading(false);
      });
    }
  }, [isSwitchOn, dispatch]);

  const getAddress = (long, lat) => {
    axios
      .put(
        import.meta.env.REACT_APP_API_URL + `gps`,
        {
          longitude: long,
          latitude: lat,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const [, ...restArray] = response.data.split(" ");
        const formattedLocation = restArray.join(" ");
        dispatch(setLocation(formattedLocation));
      })
      .catch((error) => {
        console.error("주소변환 실패:", error);
      });
  };

  const turnOffGps = () => {
    axios
      .get(import.meta.env.REACT_APP_API_URL + `gps`, {
        withCredentials: true,
      })
      .then((response) => {
        dispatch(setLocation(null));
        dispatch(setLocationLongLat([]));
      })
      .catch((error) => {
        console.error("gps off error:", error);
      });
  };

  const handleRefresh = () => {
    if (isSwitchOn) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(
          setLocation(
            getAddress(position.coords.longitude, position.coords.latitude)
          )
        );
        dispatch(
          setLocationLongLat([
            position.coords.longitude,
            position.coords.latitude,
          ])
        );
        setIsLoading(false);
      });
    }
  };

  return (
    <div id="gps-container">
      <div id="gps-top">
        <FormControlLabel
          labelPlacement="start"
          label="GPS"
          control={
            <IOSSwitch
              checked={isSwitchOn}
              onChange={handleSwitchChange}
              sx={{ m: 1 }}
            />
          }
        />
        <div id="refresh-container">
          <ReplayCircleFilledOutlined onClick={handleRefresh} />
        </div>
      </div>
      {isLoading && <CircularProgress id="loading-text" />}
      {isSwitchOn && !isLoading && (
        <div id="gps-bottom">
          <LocationOnOutlined id="location-icon" />
          <div>{currentUser.location}</div>
        </div>
      )}
    </div>
  );
}
