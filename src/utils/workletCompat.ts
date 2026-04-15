/**
 * Worklet compatibility layer.
 *
 * Tries to use `react-native-worklets` (required for React Native 0.78+).
 * Falls back to `runOnJS` / `runOnUI` from `react-native-reanimated` so the
 * library remains usable on React Native 0.76.x where `react-native-worklets`
 * is not yet supported.
 */

type ScheduleOnRN = <Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  ...args: Args
) => void;

type ScheduleOnUI = (fn: () => void) => void;

let scheduleOnRNImpl: ScheduleOnRN;
let scheduleOnUIImpl: ScheduleOnUI;

try {
  // Preferred path: react-native-worklets (RN 0.78+).
  const worklets = require('react-native-worklets');
  scheduleOnRNImpl = worklets.scheduleOnRN;
  scheduleOnUIImpl = worklets.scheduleOnUI;
} catch (_workletsError) {
  // Fallback: use the runOnJS/runOnUI helpers shipped with reanimated.
  const reanimated = require('react-native-reanimated');
  const { runOnJS, runOnUI } = reanimated;

  scheduleOnRNImpl = ((fn, ...args) => {
    'worklet';
    // runOnJS returns a function that, when invoked from the UI thread,
    // schedules `fn` on the JS thread. When invoked from the JS thread it
    // simply forwards the call. Both behaviors match `scheduleOnRN`.
    runOnJS(fn)(...args);
  }) as ScheduleOnRN;

  scheduleOnUIImpl = ((fn) => {
    runOnUI(fn)();
  }) as ScheduleOnUI;
}

export const scheduleOnRN = scheduleOnRNImpl;
export const scheduleOnUI = scheduleOnUIImpl;
