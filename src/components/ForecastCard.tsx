import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {getWeatherIconUrl} from '../services/weatherApi';

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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    width: '30%',
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
    marginHorizontal: 4,
  },
  temperatureMax: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066ff',
    marginHorizontal: 8,
  },
  temperatureMin: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
});

export default ForecastCard;
