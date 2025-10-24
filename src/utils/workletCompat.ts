/**
 * Worklet compatibility layer
 *
 * This module provides backward compatibility for react-native-worklets.
 * It tries to use react-native-worklets if available, otherwise falls back
 * to react-native-reanimated's built-in functions for older React Native versions.
 */

type ScheduleOnRN = <T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
) => void;

type ScheduleOnUI = (fn: () => void) => void;

let scheduleOnRN: ScheduleOnRN;
let scheduleOnUI: ScheduleOnUI;

try {
  // Try to import from react-native-worklets (RN 0.78+)
  const worklets = require('react-native-worklets');
  scheduleOnRN = worklets.scheduleOnRN;
  scheduleOnUI = worklets.scheduleOnUI;
} catch (e) {
  // Fall back to react-native-reanimated for older versions (RN 0.76.x)
  try {
    const reanimated = require('react-native-reanimated');
    const runOnJS = reanimated.runOnJS;
    const runOnUI = reanimated.runOnUI;

    // scheduleOnRN is equivalent to runOnJS
    scheduleOnRN = ((fn: any, ...args: any[]) => {
      'worklet';
      if (args.length > 0) {
        runOnJS(fn)(...args);
      } else {
        runOnJS(fn)();
      }
    }) as ScheduleOnRN;

    // scheduleOnUI is equivalent to runOnUI
    scheduleOnUI = ((fn: () => void) => {
      'worklet';
      runOnUI(fn)();
    }) as ScheduleOnUI;
  } catch (reanimatedError) {
    // If neither is available, throw an error
    throw new Error(
      'rn-swiper-list requires either react-native-worklets or react-native-reanimated to be installed. ' +
        'Please install one of these dependencies.'
    );
  }
}

export { scheduleOnRN, scheduleOnUI };
