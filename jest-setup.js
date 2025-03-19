jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  dismiss: jest.fn(),
  isVisible: jest.fn(() => false),
  addListener: jest.fn(() => ({remove: jest.fn()})),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.KeyboardAvoidingView = ({children}) => children;

  RN.TouchableOpacity = ({children, onPress, ...props}) => (
    <div onClick={onPress} {...props}>
      {children}
    </div>
  );

  RN.ScrollView = ({children, ...props}) => <div {...props}>{children}</div>;

  RN.ActivityIndicator = () => <div data-testid="activity-indicator" />;

  return RN;
});

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children}) => children,
    useSafeAreaInsets: () => inset,
  };
});

global.console = {
  ...console,
  // Make console.error and console.warn throw so we can catch them in tests
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
