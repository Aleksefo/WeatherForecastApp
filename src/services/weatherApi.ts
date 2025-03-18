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

export const getCurrentWeather = async (
  city: string = 'Helsinki',
  country: string = 'Finland',
): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city},${country}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getFiveDayForecast = async (
  city: string = 'Helsinki',
  country: string = 'Finland',
): Promise<ForecastData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city},${country}&units=metric&appid=${API_KEY}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
