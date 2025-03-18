import {State} from './types';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';

const storage = new MMKV();
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export const useAppStore = create<State>()(
  devtools(
    persist(
      set => ({
        savedLocation: '',
        recentSearches: [],
        setLocation: location => set(() => ({savedLocation: location})),
        addRecentSearch: (location: string) =>
          set(state => {
            // Remove location if it already exists
            const filteredSearches = state.recentSearches.filter(
              item => item.toLowerCase() !== location.toLowerCase(),
            );
            return {
              recentSearches: [location, ...filteredSearches].slice(0, 5),
              savedLocation: location,
            };
          }),

        clearRecentSearches: () => set({recentSearches: []}),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);
