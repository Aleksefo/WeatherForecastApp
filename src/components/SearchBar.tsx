import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {colors, spacing, typography, shadows, borderRadius} from '../styles/theme';

interface SearchBarProps {
  onSearch: (city: string) => void;
  recentSearches: string[];
  onSelectRecentSearch: (city: string) => void;
  isLoading: boolean;
}

export interface SearchBarRef {
  blur: () => void;
  dismissDropdown: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({
  onSearch,
  recentSearches,
  onSelectRecentSearch,
  isLoading,
}, ref) => {
  const [cityInput, setCityInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    blur: () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    dismissDropdown: () => {
      setShowRecentSearches(false);
    },
  }));

  const validateCity = (city: string): boolean => {
    setInputError(null);

    if (!city.trim()) {
      setInputError('Please enter a city name');
      return false;
    }

    if (city.trim().length < 2) {
      setInputError('City name must be at least 2 characters');
      return false;
    }

    if (!/^[a-zA-Z\\s-]+$/.test(city.trim())) {
      setInputError('City name can only contain letters, spaces, and hyphens');
      return false;
    }

    return true;
  };

  const handleSearch = () => {
    if (validateCity(cityInput)) {
      const trimmedCity = cityInput.trim();

      if (!isLoading) {
        onSearch(trimmedCity);
        setCityInput('');

        if (inputRef.current) {
          inputRef.current.blur();
        }
        Keyboard.dismiss();

        setShowRecentSearches(false);
      }
    }
  };

  const handleRecentSearch = (city: string) => {
    if (!isLoading) {
      onSelectRecentSearch(city);
      setCityInput('');

      if (inputRef.current) {
        inputRef.current.blur();
      }
      Keyboard.dismiss();

      setShowRecentSearches(false);
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Enter city name"
            value={cityInput}
            onChangeText={text => {
              setCityInput(text);
              setInputError(null);
            }}
            onFocus={() => setShowRecentSearches(true)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          {showRecentSearches && recentSearches.length > 0 && (
            <View style={styles.recentSearchesDropdown}>
              {recentSearches.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(city)}>
                  <Text style={styles.recentSearchText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {inputError && (
        <Text style={styles.inputErrorText}>{inputError}</Text>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    ...typography.body,
    color: colors.textDark,
  },
  recentSearchesDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderTopWidth: 0,
    borderRadius: borderRadius.medium,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 10,
    // Use shadows.medium but avoid its elevation property
    shadowColor: shadows.medium.shadowColor,
    shadowOffset: shadows.medium.shadowOffset,
    shadowOpacity: shadows.medium.shadowOpacity,
    shadowRadius: shadows.medium.shadowRadius,
    elevation: 5,
  },
  recentSearchItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123, 44, 191, 0.1)',
  },
  recentSearchText: {
    ...typography.body,
    color: colors.textDark,
  },
  searchButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  searchButtonText: {
    color: 'white',
    ...typography.body,
    fontWeight: 'bold', // Override the normal fontWeight from typography.body
  },
  inputErrorText: {
    color: colors.error,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...typography.caption,
  },
});

export default SearchBar;
