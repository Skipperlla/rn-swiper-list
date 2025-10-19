import { type JSX, type PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
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
  overlayLabelContainerStyle?: StyleProp<ViewStyle>;
}>;

const OverlayLabel = ({
  inputRange,
  outputRange,
  Component,
  opacityValue,
  overlayLabelContainerStyle,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacityValue.value,
        inputRange ?? [],
        outputRange ?? [],
        'clamp'
      ),
      zIndex: 3,
    };
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        animatedStyle,
        overlayLabelContainerStyle,
      ]}
      pointerEvents="none"
    >
      <Component />
    </Animated.View>
  );
};

export default OverlayLabel;
