import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export { default as Swiper } from './Swiper';

export type SwiperCardRefType =
  | {
      swipeRight: () => void;
      swipeLeft: () => void;
      swipeBack: () => void;
      swipeTop: () => void;
    }
  | undefined;

export type SwiperOptions<T> = {
  //* Card Props
  data: T[];
  renderCard: (item: T, index: number) => JSX.Element;
  cardStyle?: StyleProp<ViewStyle>;
  //* Event callbacks
  onSwipeLeft?: (cardIndex: number) => void;
  onSwipeRight?: (cardIndex: number) => void;
  onSwipeTop?: (cardIndex: number) => void;
  onSwipedAll?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onSwipeActive?: () => void;
  //* Swipe Animation Props
  disableRightSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableTopSwipe?: boolean;
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
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
  //* Misc
  chunkSize?: number;
};
export type SwiperCardOptions = {
  index: number;
  activeIndex: SharedValue<number>;
  onSwipeRight?: (index: number) => void;
  onSwipeLeft?: (index: number) => void;
  onSwipeTop?: (index: number) => void;
  onSwipeStart?: () => void;
  onSwipeActive?: () => void;
  onSwipeEnd?: () => void;
  cardStyle?: StyleProp<ViewStyle>;
  disableRightSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableTopSwipe?: boolean;
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
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
};
