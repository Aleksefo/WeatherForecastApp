import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import WeatherCard from '../components/WeatherCard';
import {getCurrentWeather, WeatherData} from '../services/weatherApi';

function HomeScreen(): React.JSX.Element {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const data = await getCurrentWeather();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Refresh data every 10 minutes
    const intervalId = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-FI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <Text style={styles.header}>Weather Today</Text>

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
          <WeatherCard
            temperature={weatherData.main.temp}
            feelsLike={weatherData.main.feels_like}
            description={weatherData.weather[0].description}
            iconCode={weatherData.weather[0].icon}
            windSpeed={weatherData.wind.speed}
            humidity={weatherData.main.humidity}
          />
        ) : null}

        {weatherData && (
          <View style={styles.extraDetailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Min Temp</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weatherData.main.temp_min)}°C
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Max Temp</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weatherData.main.temp_max)}°C
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>
                  {weatherData.main.pressure} hPa
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>
                  {weatherData.main.humidity}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
    flex: 1,
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
