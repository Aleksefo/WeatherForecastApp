import axios from 'axios';
import {
  getCurrentWeather,
  getFiveDayForecast,
  getWeatherIconUrl,
} from '../weatherApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Weather API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather for a given city', async () => {
      const mockWeatherData = {
        main: {
          temp: 20.5,
          feels_like: 19.2,
          temp_min: 18.9,
          temp_max: 22.3,
          pressure: 1013,
          humidity: 65,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        wind: {
          speed: 3.1,
          deg: 240,
        },
        name: 'Valencia',
        dt: 1616578800,
        sys: {
          country: 'ES',
          sunrise: 1616565427,
          sunset: 1616609273,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({data: mockWeatherData});

      const result = await getCurrentWeather('Valencia', 'Spain');

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather?q=Valencia,Spain'),
      );

      expect(result).toEqual(mockWeatherData);
    });

    it('should use default parameters if none are provided', async () => {
      const mockWeatherData = {
        main: {temp: 15},
        weather: [
          {id: 800, main: 'Clear', description: 'clear sky', icon: '01d'},
        ],
        wind: {speed: 3.1, deg: 240},
        name: 'Helsinki',
        dt: 1616578800,
        sys: {country: 'FI', sunrise: 1616565427, sunset: 1616609273},
      };
      mockedAxios.get.mockResolvedValueOnce({data: mockWeatherData});

      const result = await getCurrentWeather();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather?q=Helsinki,Finland'),
      );
      expect(result).toEqual(mockWeatherData);
    });

    it('should throw an error when the API call fails', async () => {
      const errorResponse = new Error('API Error');
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(getCurrentWeather('InvalidCity')).rejects.toThrow(
        'API Error',
      );

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFiveDayForecast', () => {
    it('should fetch 5-day forecast for a given city', async () => {
      const mockForecastData = {
        list: [
          {
            dt: 1616598800,
            main: {
              temp: 18.5,
              feels_like: 17.2,
              temp_min: 17.9,
              temp_max: 19.3,
              pressure: 1015,
              humidity: 70,
            },
            weather: [
              {
                id: 801,
                main: 'Clouds',
                description: 'few clouds',
                icon: '02d',
              },
            ],
            wind: {
              speed: 2.6,
              deg: 220,
            },
            dt_txt: '2021-03-24 15:00:00',
          },
        ],
        city: {
          name: 'Valencia',
          country: 'ES',
          sunrise: 1616565427,
          sunset: 1616609273,
        },
      };
      mockedAxios.get.mockResolvedValueOnce({data: mockForecastData});

      const result = await getFiveDayForecast('Valencia', 'Spain');

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/forecast?q=Valencia,Spain'),
      );
      expect(result).toEqual(mockForecastData);
    });

    it('should use default parameters if none are provided', async () => {
      const mockForecastData = {
        list: [],
        city: {
          name: 'Helsinki',
          country: 'FI',
          sunrise: 1616565427,
          sunset: 1616609273,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({data: mockForecastData});
      const result = await getFiveDayForecast();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/forecast?q=Helsinki,Finland'),
      );

      expect(result).toEqual(mockForecastData);
    });

    it('should throw an error when the API call fails', async () => {
      const errorResponse = new Error('API Error');
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(getFiveDayForecast('InvalidCity')).rejects.toThrow(
        'API Error',
      );

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWeatherIconUrl', () => {
    it('should return the correct URL for a given icon code', () => {
      const url = getWeatherIconUrl('01d');

      expect(url).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });
  });
});
