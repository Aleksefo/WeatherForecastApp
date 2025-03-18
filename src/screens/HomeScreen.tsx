import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import {
  getCurrentWeather,
  getFiveDayForecast,
  WeatherData,
  ForecastData,
} from '../services/weatherApi';

function HomeScreen(): React.JSX.Element {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('Helsinki');

  const fetchWeatherData = useCallback(
    async (city: string = currentCity) => {
      try {
        setLoading(true);
        const [currentData, forecastResponse] = await Promise.all([
          getCurrentWeather(city),
          getFiveDayForecast(city),
        ]);
        setWeatherData(currentData);
        setForecastData(forecastResponse);
        setCurrentCity(city);
        setError(null);
      } catch (err) {
        setError(
          'Failed to fetch weather data. Please check the city name and try again.',
        );
      } finally {
        setLoading(false);
      }
    },
    [currentCity],
  );

  useEffect(() => {
    fetchWeatherData();

    // Refresh data every 10 minutes
    const intervalId = setInterval(() => fetchWeatherData(), 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchWeatherData]);

  const handleSearch = () => {
    if (cityInput.trim()) {
      fetchWeatherData(cityInput.trim());
      setCityInput('');
      Keyboard.dismiss();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-FI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-FI', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDayOfWeek = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-FI', {
      weekday: 'long',
    });
  };

  const processForecastData = () => {
    if (!forecastData) {
      return [];
    }

    // The API returns forecast data every 3 hours
    // We need to group by day and calculate min/max temperatures and find day/night icons
    const dailyDataMap = new Map();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Group forecast items by day
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const hour = date.getHours();
      const isDay = hour >= 6 && hour < 18; // Simple day/night check

      // Skip today's forecasts
      if (day === todayStr) {
        continue;
      }

      if (!dailyDataMap.has(day)) {
        dailyDataMap.set(day, {
          dt: item.dt,
          temp_min: item.main.temp,
          temp_max: item.main.temp,
          day_icon: isDay ? item.weather[0].icon : null,
          night_icon: !isDay ? item.weather[0].icon : null,
          day,
        });
      } else {
        const existing = dailyDataMap.get(day);

        // Update min/max temperatures
        if (item.main.temp_min < existing.temp_min) {
          existing.temp_min = item.main.temp_min;
        }
        if (item.main.temp_max > existing.temp_max) {
          existing.temp_max = item.main.temp_max;
        }

        // Update day/night icons
        if (isDay && (!existing.day_icon || (hour >= 12 && hour <= 14))) {
          // Prefer noon for day icon
          existing.day_icon = item.weather[0].icon;
        } else if (
          !isDay &&
          (!existing.night_icon || (hour >= 0 && hour <= 2))
        ) {
          // Prefer midnight for night icon
          existing.night_icon = item.weather[0].icon;
        }

        // Use noon timestamp for the day record
        if (hour >= 12 && hour <= 14) {
          existing.dt = item.dt;
        }
      }
    }

    // Post-process: ensure both icons exist, if not, use the other one as fallback
    for (const [_, data] of dailyDataMap.entries()) {
      if (!data.day_icon && data.night_icon) {
        data.day_icon = data.night_icon;
      } else if (!data.night_icon && data.day_icon) {
        data.night_icon = data.day_icon;
      } else if (!data.day_icon && !data.night_icon) {
        // Fallback icons if somehow we didn't get any
        data.day_icon = '01d';
        data.night_icon = '01n';
      }
    }

    // Convert map to array and take first 5 days
    return Array.from(dailyDataMap.values())
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(0, 5);
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
          <Text style={styles.header}>Weather Today</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city name"
              value={cityInput}
              onChangeText={setCityInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

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
              <View style={styles.forecastContainer}>
                <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                {processForecastData().map((item, index) => (
                  <ForecastCard
                    key={index}
                    date={formatShortDate(item.dt)}
                    dayOfWeek={getDayOfWeek(item.dt)}
                    tempMin={item.temp_min}
                    tempMax={item.temp_max}
                    dayIconCode={item.day_icon}
                    nightIconCode={item.night_icon}
                  />
                ))}
              </View>
            </>
          ) : null}
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#0066ff',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  forecastContainer: {
    marginTop: 32,
  },
  forecastTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0066ff',
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
