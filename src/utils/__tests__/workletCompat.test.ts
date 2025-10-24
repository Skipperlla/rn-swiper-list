/**
 * @jest-environment node
 */

import { jest } from '@jest/globals';

describe('workletCompat', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should use react-native-worklets when available', () => {
    // Mock react-native-worklets
    jest.doMock('react-native-worklets', () => ({
      scheduleOnRN: jest.fn(),
      scheduleOnUI: jest.fn(),
    }));

    const { scheduleOnRN, scheduleOnUI } = require('../workletCompat');
    const worklets = require('react-native-worklets');

    expect(scheduleOnRN).toBe(worklets.scheduleOnRN);
    expect(scheduleOnUI).toBe(worklets.scheduleOnUI);
  });

  it('should fall back to react-native-reanimated when worklets is not available', () => {
    // Mock react-native-worklets to throw (not installed)
    jest.doMock('react-native-worklets', () => {
      throw new Error('Module not found');
    });

    // Mock react-native-reanimated
    const mockRunOnJS = jest.fn((fn) => (...args: any[]) => fn(...args));
    const mockRunOnUI = jest.fn((fn) => () => fn());

    jest.doMock('react-native-reanimated', () => ({
      runOnJS: mockRunOnJS,
      runOnUI: mockRunOnUI,
    }));

    const { scheduleOnRN, scheduleOnUI } = require('../workletCompat');

    // Test scheduleOnRN
    expect(typeof scheduleOnRN).toBe('function');
    expect(typeof scheduleOnUI).toBe('function');
  });

  it('should throw error when neither worklets nor reanimated is available', () => {
    // Mock both to throw
    jest.doMock('react-native-worklets', () => {
      throw new Error('Module not found');
    });

    jest.doMock('react-native-reanimated', () => {
      throw new Error('Module not found');
    });

    expect(() => {
      require('../workletCompat');
    }).toThrow(
      'rn-swiper-list requires either react-native-worklets or react-native-reanimated to be installed'
    );
  });
});
