import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  x: Animated.SharedValue<number>;
  inputRange: number[];
  outputRange: number[];
  Component: () => JSX.Element;
}>;

const OverlayLabel = ({ x, inputRange, outputRange, Component }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        x.value,
        inputRange,
        outputRange,
        Extrapolation.CLAMP
      ),
      zIndex: 100,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
      <Component />
    </Animated.View>
  );
};

export default OverlayLabel;
