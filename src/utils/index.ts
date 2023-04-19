import { Dimensions } from 'react-native';
import Animated, { withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('screen');

const userConfig = {
  damping: 15, // Controls the speed of the animation
  stiffness: 120, // Controls the bounciness of the animation
  mass: 1, // Represents the mass of the object being animated
  overshootClamping: false, // Prevents the spring from overshooting its target value
  restDisplacementThreshold: 0.001, // Controls when the spring is considered to be at rest
  restSpeedThreshold: 0.001, // Controls the speed at which the spring is considered to be at rest
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
  translateY: Animated.SharedValue<number>
) {
  'worklet';

  if (Math.sign(destX) === 1 && !disableRightSwipe)
    translateX.value = withSpring(width + cardWidth + 50, {
      velocity: velocityX,
    });
  else if (Math.sign(destX) === -1 && !disableLeftSwipe)
    translateX.value = withSpring(-width - cardWidth - 50, {
      velocity: velocityX,
    });
  else resetPosition(translateX, translateY);
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
export { resetPosition, updatePosition, snapPoint };
