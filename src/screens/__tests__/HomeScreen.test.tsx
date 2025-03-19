import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import {getCurrentWeather, getFiveDayForecast} from '../../services/weatherApi';
import {useAppStore} from '../../state/AppState';

jest.mock('../../services/weatherApi', () => ({
  getCurrentWeather: jest.fn(),
  getFiveDayForecast: jest.fn(),
  getWeatherIconUrl: jest.fn(iconCode => `https://mockurl.com/${iconCode}.png`),
}));

jest.mock('../../components/SearchBar', () => {
  const {forwardRef} = jest.requireActual('react');
  return {
    __esModule: true,
    SearchBarRef: {},
    default: forwardRef(
      (_props: Record<string, unknown>, _ref: React.Ref<unknown>) => (
        <div data-testid="mock-search-bar" />
      ),
    ),
  };
});

jest.mock('../../components/WeatherCard', () => {
  return function MockWeatherCard() {
    return <div data-testid="mock-weather-card" />;
  };
});

jest.mock('../../components/ForecastList', () => {
  return function MockForecastList() {
    return <div data-testid="mock-forecast-list" />;
  };
});

jest.mock('../../state/AppState', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('../../services/dateFormatter', () => ({
  formatDate: jest.fn(() => 'Wednesday, March 24, 2021'),
}));

describe('HomeScreen Component', () => {
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

  const mockStore = {
    savedLocation: 'Valencia',
    recentSearches: ['Valencia', 'Madrid', 'Barcelona'],
    setLocation: jest.fn(),
    addRecentSearch: jest.fn(),
    clearRecentSearches: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (getCurrentWeather as unknown as jest.Mock).mockResolvedValue(
      mockWeatherData,
    );
    (getFiveDayForecast as unknown as jest.Mock).mockResolvedValue(
      mockForecastData,
    );
  });

  it('should fetch weather data on mount', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(getCurrentWeather).toHaveBeenCalledWith('Valencia');
      expect(getFiveDayForecast).toHaveBeenCalledWith('Valencia');
    });
  });

  it('should display the location from weather data', async () => {
    const {findByText} = render(<HomeScreen />);

    const locationElement = await findByText('Valencia, ES');
    expect(locationElement).toBeTruthy();
  });

  it('should handle API errors correctly', async () => {
    (getCurrentWeather as unknown as jest.Mock).mockRejectedValueOnce({
      response: {status: 404},
    });
    (getFiveDayForecast as unknown as jest.Mock).mockRejectedValueOnce({
      response: {status: 404},
    });

    const {findByText} = render(<HomeScreen />);

    const errorElement = await findByText(/City "Valencia" not found/);
    expect(errorElement).toBeTruthy();
  });

  it('should fetch weather for the saved location on mount', async () => {
    mockStore.savedLocation = 'Paris';

    render(<HomeScreen />);

    await waitFor(() => {
      expect(getCurrentWeather).toHaveBeenCalledWith('Paris');
      expect(getFiveDayForecast).toHaveBeenCalledWith('Paris');
    });
  });
});
