import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Coordinates} from './weatherApi';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    try {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      return granted === 'granted';
    } catch (err) {
      __DEV__ &&
        console.error('Error requesting iOS location permission:', err);
      return false;
    }
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Weather App Location Permission',
          message:
            'Weather App needs access to your location to show local weather data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      __DEV__ &&
        console.error('Error requesting Android location permission:', err);
      return false;
    }
  }
  return false;
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      reject(
        new Error('Geolocation is only available on iOS and Android devices'),
      );
      return;
    }

    Geolocation.getCurrentPosition(
      (position: any) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        resolve(coords);
      },
      (error: any) => {
        __DEV__ && console.error('Error getting location:', error);
        reject(
          new Error('Could not get current location. Please try again later.'),
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};
