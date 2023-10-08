import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  inputRange?: number[];
  outputRange?: number[];
  Component: () => JSX.Element;
  opacityValue: Animated.SharedValue<number>;
}>;

const OverlayLabel = ({
  inputRange,
  outputRange,
  Component,
  opacityValue,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacityValue.value,
        inputRange ?? [],
        outputRange ?? [],
        Extrapolation.CLAMP
      ),
      zIndex: 2,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
      pointerEvents="none"
    >
      <Component />
    </Animated.View>
  );
};

export default OverlayLabel;
