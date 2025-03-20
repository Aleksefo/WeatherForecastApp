import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {getWeatherIconUrl} from '../services/weatherApi';
import {colors, spacing, typography, borderRadius} from '../styles/theme';

interface ForecastCardProps {
  date: string;
  dayOfWeek: string;
  tempMin: number;
  tempMax: number;
  dayIconCode: string;
  nightIconCode: string;
}

const ForecastCard = ({
  date,
  dayOfWeek,
  tempMin,
  tempMax,
  dayIconCode,
  nightIconCode,
}: ForecastCardProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Image
          source={{uri: getWeatherIconUrl(dayIconCode)}}
          style={styles.weatherIcon}
        />
        <Image
          source={{uri: getWeatherIconUrl(nightIconCode)}}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperatureMax}>{Math.round(tempMax)}°</Text>
        <Text style={styles.temperatureMin}>{Math.round(tempMin)}°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLight,
  },
  dateContainer: {
    width: '30%',
  },
  dayOfWeek: {
    ...typography.body,
    fontWeight: 'bold', // Override the normal fontWeight from typography.body
    color: colors.textDark,
  },
  date: {
    ...typography.caption,
    color: colors.textMedium,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '70%',
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginHorizontal: spacing.xs,
  },
  temperatureMax: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.primary,
    marginHorizontal: spacing.sm,
  },
  temperatureMin: {
    fontSize: 16,
    color: colors.textMedium,
    marginHorizontal: spacing.sm,
  },
});

export default ForecastCard;
