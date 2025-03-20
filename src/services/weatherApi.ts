import axios from 'axios';

const API_KEY = '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export const getCurrentWeatherByCity = async (
  city: string = 'Helsinki',
  country: string = 'Finland',
): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city},${country}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    __DEV__ && console.error('Error fetching current weather by city:', error);
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (
  coords: Coordinates
): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    __DEV__ && console.error('Error fetching current weather by coords:', error);
    throw error;
  }
};

export const getCurrentWeather = async (
  cityOrCoords: string | Coordinates = 'Helsinki',
  country: string = 'Finland',
): Promise<WeatherData> => {
  if (typeof cityOrCoords === 'string') {
    return getCurrentWeatherByCity(cityOrCoords, country);
  } else {
    return getCurrentWeatherByCoords(cityOrCoords);
  }
};

export const getFiveDayForecastByCity = async (
  city: string = 'Helsinki',
  country: string = 'Finland',
): Promise<ForecastData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city},${country}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    __DEV__ && console.error('Error fetching forecast by city:', error);
    throw error;
  }
};

export const getFiveDayForecastByCoords = async (
  coords: Coordinates
): Promise<ForecastData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    __DEV__ && console.error('Error fetching forecast by coords:', error);
    throw error;
  }
};

export const getFiveDayForecast = async (
  cityOrCoords: string | Coordinates = 'Helsinki',
  country: string = 'Finland',
): Promise<ForecastData> => {
  if (typeof cityOrCoords === 'string') {
    return getFiveDayForecastByCity(cityOrCoords, country);
  } else {
    return getFiveDayForecastByCoords(cityOrCoords);
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
