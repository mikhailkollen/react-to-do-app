import "./WeatherWidget.css";
import { useState, useEffect, useCallback } from "react";
import { WeatherData } from "../../types";

export const WeatherWidget = () => {
  const API_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;
  const requestUserLocation = useCallback(
  () => {
    return new Promise<string>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve(`${lat},${lon}`);
          },
          () => {
            resolve("Tbilisi");
          }
        );
      } else {
        resolve("Tbilisi");
      }
    });
  },
  []
);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getWeatherData = useCallback(async () => {
    try {
      const location = await requestUserLocation();
      const response = await fetch(
        `${API_URL}${location}`
      );
      const weatherData = await response.json();
      setWeatherData(weatherData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [requestUserLocation]);

  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="weather-widget">
      <div className="weather-and-temp">
        <img
          className="weather-icon"
          src={weatherData ? weatherData.current.condition.icon : undefined}
        />
        <h2>{weatherData && weatherData.current.temp_c}°C</h2>
      </div>
      <h2 className="weather-widget-city">
        {weatherData && weatherData.location.name}
      </h2>
    </div>
  );
};