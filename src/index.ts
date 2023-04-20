import { PropsWithChildren } from 'react';
import { ViewStyle, StyleProp } from 'react-native';

export { default as TinderCard } from './CardItem';

export type TinderCardOptions = PropsWithChildren<{
  /**
   * The card of the width.
   */
  cardWidth: number;
  /**
   * The card of the height.
   */
  cardHeight: number;
  /**
   * The card of the x coordinate.
   */
  translateXRange: number[];
  /**
   * The card of the y coordinate.
   */
  translateYRange: number[];

  /**
   * The card of the input and output rotation range.
   */
  inputRotationRange: number[];
  outputRotationRange: number[];

  /**
   * The card of the input and output swipe direction opacity range.
   */
  inputOpacityRange: number[];
  outputOpacityRange: number[];

  /**
   * Disable Right,Left and Top Swipe
   */
  disableRightSwipe: boolean;
  disableLeftSwipe: boolean;
  disableTopSwipe: boolean;

  /**
   * The card of the style.
   */
  cardStyle: StyleProp<ViewStyle>;

  /**
   * The card of the callbacks.
   */
  onSwipedRight: () => void;
  onSwipedLeft: () => void;
  onSwipedTop: () => void;

  /**
   * The card of the animation scale value.
   */
  scaleValue: number;
}>;
