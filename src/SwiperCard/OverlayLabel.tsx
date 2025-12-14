import { type JSX, type PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Props = PropsWithChildren<{
  inputRange?: number[];
  outputRange?: number[];
  Component: () => JSX.Element;
  opacityValue: SharedValue<number>;
  overlayLabelContainerStyle?: StyleProp<ViewStyle>;
  onVisible?: () => void; // 🆕 Nouveau
}>;

const OverlayLabel = ({
  inputRange,
  outputRange,
  Component,
  opacityValue,
  overlayLabelContainerStyle,
  onVisible, // 🆕 Nouveau
}: Props) => {
  // 🆕 Détecte quand l'overlay devient visible
  useAnimatedReaction(
    () => {
      const opacity = interpolate(
        opacityValue.value,
        inputRange ?? [],
        outputRange ?? [],
        'clamp'
      );
      return opacity;
    },
    (currentOpacity, previousOpacity) => {
      // Trigger callback when opacity crosses threshold (0.3 = ~30% visible)
      if (onVisible && previousOpacity !== null && previousOpacity <= 0.3 && currentOpacity > 0.3) {
        scheduleOnRN(onVisible);
      }
    }
  );

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