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
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from '../styles/theme';

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
        __DEV__ && console.error('Weather API error:', err);
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
                <ActivityIndicator size="large" color={colors.primary} />
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
    backgroundColor: colors.background,
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
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    textAlign: 'center',
    marginVertical: spacing.sm,
    color: colors.textDark,
  },
  date: {
    ...typography.body,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    ...shadows.small,
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.textMedium,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    borderRadius: borderRadius.medium,
    marginVertical: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    ...typography.body,
    fontWeight: '500' as const,
  },
  extraDetailsContainer: {
    marginTop: spacing.xl,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    ...shadows.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMedium,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600' as const,
    color: colors.textDark,
  },
});

export default HomeScreen;
