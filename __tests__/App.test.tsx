/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock the AppNavigator
jest.mock('../src/navigation/AppNavigator', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-navigator">App Navigator</div>,
  };
});

// Now import App after mocking dependencies
import App from '../App';

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }: { children: React.ReactNode }) => children,
      Screen: ({ children }: { children: React.ReactNode }) => children,
    }),
  };
});

// Simple test case that just checks if App renders without crashing
test('renders correctly', () => {
  render(<App />);
});
