import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';

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
    marginBottom: 8,
    marginHorizontal: 8,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  recentSearchesDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentSearchItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#0066ff',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputErrorText: {
    color: '#d32f2f',
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
  },
});

export default SearchBar;
