import React, { type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  inputRange?: number[];
  outputRange?: number[];
  Component: () => JSX.Element;
  opacityValue: SharedValue<number>;
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
        'clamp'
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
