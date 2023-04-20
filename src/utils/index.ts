import { Dimensions } from 'react-native';
import Animated, { runOnJS, withSpring } from 'react-native-reanimated';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const userConfig = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

function resetPosition(
  x: Animated.SharedValue<number>,
  y: Animated.SharedValue<number>
): void {
  'worklet';
  x.value = withSpring(0, userConfig);
  y.value = withSpring(0, userConfig);
}

function updatePosition(
  destX: number,
  disableRightSwipe: boolean,
  translateX: Animated.SharedValue<number>,
  cardWidth: number,
  velocityX: number,
  disableLeftSwipe: boolean,
  translateY: Animated.SharedValue<number>,
  onSwipedRight: () => void,
  onSwipedLeft: () => void
) {
  'worklet';

  if (Math.sign(destX) === 1 && !disableRightSwipe) {
    translateX.value = withSpring(windowWidth + cardWidth + 50, {
      velocity: velocityX,
    });
    runOnJS(onSwipedRight)();
  } else if (Math.sign(destX) === -1 && !disableLeftSwipe) {
    translateX.value = withSpring(-windowWidth - cardWidth - 50, {
      velocity: velocityX,
    });
    runOnJS(onSwipedLeft)();
  } else resetPosition(translateX, translateY);
}

const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return Number(points.filter((p) => Math.abs(point - p) === minDelta)[0]);
};
export {
  resetPosition,
  updatePosition,
  snapPoint,
  userConfig,
  windowWidth,
  windowHeight,
};
