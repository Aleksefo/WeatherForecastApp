export interface State {
  savedLocation: string;
  recentSearches: string[];
  setLocation: (location: string) => void;
  addRecentSearch: (location: string) => void;
  clearRecentSearches: () => void;
}
