import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import WeatherCard from '../components/WeatherCard';
import SearchBar, {SearchBarRef} from '../components/SearchBar';
import ForecastList from '../components/ForecastList';
import {
  getCurrentWeather,
  getFiveDayForecast,
  WeatherData,
  ForecastData,
} from '../services/weatherApi';
import {useAppStore} from '../state/AppState';
import {formatDate} from '../services/dateFormatter';

function HomeScreen(): React.JSX.Element {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchBarRef = useRef<SearchBarRef>(null);

  const {savedLocation, recentSearches, setLocation, addRecentSearch} =
    useAppStore();

  const fetchWeatherData = useCallback(
    async (city: string = savedLocation || 'Valencia') => {
      try {
        setLoading(true);
        setError(null);

        const [currentData, forecastResponse] = await Promise.all([
          getCurrentWeather(city),
          getFiveDayForecast(city),
        ]);

        setWeatherData(currentData);
        setForecastData(forecastResponse);
        setLocation(city);
      } catch (err: any) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
              setError(
                `City "${city}" not found. Please check the spelling and try again.`,
              );
              break;
            case 401:
              setError(
                'API key is invalid or missing. Please contact support.',
              );
              break;
            case 429:
              setError('Too many requests. Please try again later.');
              break;
            case 504:
              setError(
                'Weather service is temporarily unavailable. Please try again later.',
              );
              break;
            default:
              setError(`Error fetching weather data: ${err.response.status}`);
          }
        } else if (err.request) {
          setError(
            'Network error. Please check your internet connection and try again.',
          );
        } else {
          setError('Failed to fetch weather data. Please try again later.');
        }
        console.error('Weather API error:', err);
      } finally {
        setLoading(false);
      }
    },
    [savedLocation, setLocation],
  );

  useEffect(() => {
    fetchWeatherData();

    // Refresh data every 10 minutes
    const intervalId = setInterval(() => fetchWeatherData(), 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchWeatherData]);

  const handleSearch = (city: string) => {
    if (!loading) {
      addRecentSearch(city);
      fetchWeatherData(city);
    }
  };


  const handleOutsidePress = () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur();
      searchBarRef.current.dismissDropdown();
    }
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleOutsidePress}
            style={styles.touchableContainer}>
            <Text style={styles.header}>Weather Today</Text>

            <SearchBar
              ref={searchBarRef}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              onSelectRecentSearch={handleSearch}
              isLoading={loading}
            />

            <Text style={styles.location}>
              {weatherData
                ? `${weatherData.name}, ${weatherData.sys.country}`
                : 'Loading location...'}
            </Text>

            {weatherData && (
              <Text style={styles.date}>{formatDate(weatherData.dt)}</Text>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066ff" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : weatherData ? (
              <>
                <WeatherCard
                  temperature={weatherData.main.temp}
                  feelsLike={weatherData.main.feels_like}
                  description={weatherData.weather[0].description}
                  iconCode={weatherData.weather[0].icon}
                  windSpeed={weatherData.wind.speed}
                  humidity={weatherData.main.humidity}
                />
                <ForecastList forecastData={forecastData} />
              </>
            ) : null}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#0066ff',
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    marginVertical: 16,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  extraDetailsContainer: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
