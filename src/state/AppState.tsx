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
        setLocation: location => set(() => ({savedLocation: location})),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);
