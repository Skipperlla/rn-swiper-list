import { ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';

export { default as TinderCard } from './CardItem';

export type TinderCardOptions = {
  // Event Callbacks
  //   onSwipedRight: (index: number) => void;
  //   onSwipedLeft: (index: number) => void;
  //   onSwipedTop: (index: number) => void;
  //   Swipe animation props

  //   Rotation animation props

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
   * Disable Right,Left and Top Swipe
   */
  disableRightSwipe: boolean;
  disableLeftSwipe: boolean;
  disableTopSwipe: boolean;

  /**
   * The card of the style.
   */
  cardStyle: StyleProp<ViewStyle>;
};
