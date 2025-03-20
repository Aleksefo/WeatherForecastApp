import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ForecastData} from '../services/weatherApi';
import ForecastCard from './ForecastCard';
import {formatShortDate, getDayOfWeek} from '../services/dateFormatter';
import {colors, spacing, typography, shadows, borderRadius} from '../styles/theme';

interface ForecastListProps {
  forecastData: ForecastData | null;
}

const ForecastList: React.FC<ForecastListProps> = ({forecastData}) => {
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
      const day = date.toISOString().split('T')[0];
      const hour = date.getHours();
      const isDay = hour >= 6 && hour < 18;

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

        if (item.main.temp_min < existing.temp_min) {
          existing.temp_min = item.main.temp_min;
        }
        if (item.main.temp_max > existing.temp_max) {
          existing.temp_max = item.main.temp_max;
        }

        if (isDay && (!existing.day_icon || (hour >= 12 && hour <= 14))) {
          existing.day_icon = item.weather[0].icon;
        } else if (
          !isDay &&
          (!existing.night_icon || (hour >= 0 && hour <= 2))
        ) {
          existing.night_icon = item.weather[0].icon;
        }

        // Use noon timestamp for the day record
        if (hour >= 12 && hour <= 14) {
          existing.dt = item.dt;
        }
      }
    }

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
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>5-Day Forecast</Text>
      <View style={styles.forecastCardContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    marginTop: spacing.xl,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    ...shadows.medium,
  },
  forecastTitle: {
    ...typography.subheader,
    marginBottom: spacing.md,
    color: colors.primary,
    textAlign: 'center',
  },
  forecastCardContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
});

export default ForecastList;
