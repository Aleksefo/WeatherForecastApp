import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {getWeatherIconUrl} from '../services/weatherApi';
import {colors, spacing, shadows, borderRadius} from '../styles/theme';

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
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    ...shadows.medium,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textShadowColor: 'rgba(123, 44, 191, 0.15)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 20,
    color: colors.textMedium,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textMedium,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textDark,
  },
});

export default WeatherCard;
