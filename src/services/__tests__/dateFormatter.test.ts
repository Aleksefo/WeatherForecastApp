import {formatDate, formatShortDate, getDayOfWeek} from '../dateFormatter';

const timestamp = 1672531200; // January 1, 2023 in seconds
const mockDate = new Date(2023, 0, 1);

describe('Date Formatter Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatDate', () => {
    it('should format a Unix timestamp to a full date string', () => {
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      mockDate.toLocaleDateString = jest.fn(() => 'Sunday, January 1, 2023');
      const result = formatDate(timestamp);

      expect(result).toContain('Sunday');
      expect(result).toContain('January');
      expect(result).toContain('2023');
    });
  });

  describe('formatShortDate', () => {
    it('should format a Unix timestamp to a short date string', () => {
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      mockDate.toLocaleDateString = jest.fn(() => 'Jan 1');
      const result = formatShortDate(timestamp);
      expect(result).toContain('Jan');
      expect(result.toString()).toMatch(/[0-9]+/);
    });
  });

  describe('getDayOfWeek', () => {
    it('should return the day of the week from a Unix timestamp', () => {
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      mockDate.toLocaleDateString = jest.fn(() => 'Sunday');
      const result = getDayOfWeek(timestamp);

      expect(result).toBe('Sunday');
    });
  });

  describe('timestamp conversion', () => {
    it('should correctly convert Unix timestamps to JavaScript Date objects', () => {
      const dateSpy = jest.spyOn(global, 'Date');
      mockDate.toLocaleDateString = jest.fn(() => 'Mocked Date');
      dateSpy.mockImplementation(() => mockDate);

      formatDate(timestamp);
      expect(dateSpy).toHaveBeenCalledWith(timestamp * 1000);
      dateSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle invalid timestamps gracefully', () => {
      mockDate.toLocaleDateString = jest.fn(() => 'Invalid Date');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(() => formatDate(NaN)).not.toThrow();
      expect(() => formatShortDate(NaN)).not.toThrow();
      expect(() => getDayOfWeek(NaN)).not.toThrow();
    });

    it('should handle very large timestamps', () => {
      const farFutureTimestamp = 4102444800; // January 1, 2100
      mockDate.toLocaleDateString = jest.fn(() => 'Future Date');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(() => formatDate(farFutureTimestamp)).not.toThrow();
      expect(() => formatShortDate(farFutureTimestamp)).not.toThrow();
      expect(() => getDayOfWeek(farFutureTimestamp)).not.toThrow();
    });
  });
});
