import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import {colors, spacing, shadows, borderRadius} from '../styles/theme';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../services/locationService';
import {Coordinates} from '../services/weatherApi';

const GPSIcon = ({color, size}: {color: string; size: number}) => {
  return (
    <Text
      style={[
        iconStyles.text,
        {
          color,
          fontSize: size,
        },
      ]}>
      ⦿
    </Text>
  );
};

const iconStyles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface GPSButtonProps {
  onLocationReceived: (coords: Coordinates) => void;
  onError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GPSButton: React.FC<GPSButtonProps> = ({
  onLocationReceived,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const handleLocationRequest = async () => {
    try {
      setIsLoading(true);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location permissions in your device settings to use this feature.',
        );
        setIsLoading(false);
        return;
      }

      try {
        const coords = await getCurrentLocation();
        onLocationReceived(coords);
      } catch (locationError) {
        __DEV__ && console.error('Error getting location:', locationError);
        onError('Could not get current location. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      __DEV__ && console.error('Location error:', err);
      onError('Failed to get location. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleLocationRequest}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <GPSIcon color={colors.primary} size={20} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.small,
  },
});

export default GPSButton;
