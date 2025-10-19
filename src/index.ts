import type { StyleProp, ViewStyle } from 'react-native';
import { type JSX } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

export { default as Swiper } from './Swiper';

export type SwiperCardRefType =
  | {
      swipeRight: () => void;
      swipeLeft: () => void;
      swipeBack: () => void;
      swipeTop: () => void;
      swipeBottom: () => void;
      flipCard: () => void;
    }
  | undefined;

export type SwiperOptions<T> = {
  //* Card Props
  data: T[];
  renderCard: (item: T, index: number) => JSX.Element;
  FlippedContent?: (item: T, index: number) => JSX.Element;
  prerenderItems?: number;
  cardStyle?: StyleProp<ViewStyle>;
  flippedCardStyle?: StyleProp<ViewStyle>;
  regularCardStyle?: StyleProp<ViewStyle>;
  loop?: boolean;
  keyExtractor?: (item: T, index: number) => string | number;
  //* Event callbacks
  onSwipeLeft?: (cardIndex: number) => void;
  onSwipeRight?: (cardIndex: number) => void;
  onSwipeTop?: (cardIndex: number) => void;
  onSwipeBottom?: (cardIndex: number) => void;
  onSwipedAll?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onSwipeActive?: () => void;
  onPress?: () => void;
  //* Active Index Change Callback
  onIndexChange?: (index: number) => void;
  //* Swipe Animation Props
  disableRightSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  //* Rotation Animation Prop
  translateXRange?: number[];
  translateYRange?: number[];
  rotateInputRange?: number[];
  rotateOutputRange?: number[];
  //* Overlay Labels Animation Props
  inputOverlayLabelRightOpacityRange?: number[];
  outputOverlayLabelRightOpacityRange?: number[];
  inputOverlayLabelLeftOpacityRange?: number[];
  outputOverlayLabelLeftOpacityRange?: number[];
  inputOverlayLabelTopOpacityRange?: number[];
  outputOverlayLabelTopOpacityRange?: number[];
  inputOverlayLabelBottomOpacityRange?: number[];
  outputOverlayLabelBottomOpacityRange?: number[];
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
  OverlayLabelBottom?: () => JSX.Element;
  //* Swipe Animation Spring Configs (Animation Speed)
  swipeBackXSpringConfig?: SpringConfig;
  swipeBackYSpringConfig?: SpringConfig;
  swipeRightSpringConfig?: SpringConfig;
  swipeLeftSpringConfig?: SpringConfig;
  swipeTopSpringConfig?: SpringConfig;
  swipeBottomSpringConfig?: SpringConfig;
  swipeVelocityThreshold?: number;
  direction?: 'x' | 'y';
  flipDuration?: number;
  overlayLabelContainerStyle?: StyleProp<ViewStyle>;
};
export type SwiperCardOptions<T> = {
  item: T;
  index: number;
  activeIndex: SharedValue<number>;
  prerenderItems?: number;
  onSwipeRight?: (index: number) => void;
  onSwipeLeft?: (index: number) => void;
  onSwipeTop?: (index: number) => void;
  onSwipeBottom?: (index: number) => void;
  onSwipeStart?: () => void;
  onSwipeActive?: () => void;
  onSwipeEnd?: () => void;
  onPress?: () => void;
  cardStyle?: StyleProp<ViewStyle>;
  flippedCardStyle?: StyleProp<ViewStyle>;
  regularCardStyle?: StyleProp<ViewStyle>;
  loop?: boolean;
  disableRightSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  translateXRange?: number[];
  rotateOutputRange?: number[];
  rotateInputRange?: number[];
  translateYRange?: number[];
  inputOverlayLabelRightOpacityRange?: number[];
  outputOverlayLabelRightOpacityRange?: number[];
  inputOverlayLabelLeftOpacityRange?: number[];
  outputOverlayLabelLeftOpacityRange?: number[];
  inputOverlayLabelTopOpacityRange?: number[];
  outputOverlayLabelTopOpacityRange?: number[];
  inputOverlayLabelBottomOpacityRange?: number[];
  outputOverlayLabelBottomOpacityRange?: number[];
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
  OverlayLabelBottom?: () => JSX.Element;
  FlippedContent?: (item: T, index: number) => JSX.Element;
  swipeBackXSpringConfig?: SpringConfig;
  swipeBackYSpringConfig?: SpringConfig;
  swipeRightSpringConfig?: SpringConfig;
  swipeLeftSpringConfig?: SpringConfig;
  swipeTopSpringConfig?: SpringConfig;
  swipeBottomSpringConfig?: SpringConfig;
  swipeVelocityThreshold?: number;
  direction?: 'x' | 'y';
  flipDuration?: number;
  overlayLabelContainerStyle?: StyleProp<ViewStyle>;
};
