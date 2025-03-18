import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {getWeatherIconUrl} from '../services/weatherApi';

interface WeatherCardProps {
  temperature: number;
  feelsLike: number;
  description: string;
  iconCode: string;
  windSpeed: number;
  humidity: number;
}

function WeatherCard({
  temperature,
  feelsLike,
  description,
  iconCode,
  windSpeed,
  humidity,
}: WeatherCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.temperature}>{Math.round(temperature)}°C</Text>
        <Image
          source={{uri: getWeatherIconUrl(iconCode)}}
          style={styles.weatherIcon}
        />
      </View>

      <Text style={styles.description}>
        {description.charAt(0).toUpperCase() + description.slice(1)}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Feels like:</Text>
          <Text style={styles.detailValue}>{Math.round(feelsLike)}°C</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wind:</Text>
          <Text style={styles.detailValue}>{windSpeed} m/s</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Humidity:</Text>
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeatherCard;
