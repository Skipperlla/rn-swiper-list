import { PropsWithChildren } from 'react';
import { ViewStyle, StyleProp } from 'react-native';

export { default as TinderCard } from './CardItem';

export type TinderCardOptions = PropsWithChildren<{
  /*
  The width of the card.
  */
  cardWidth: number;

  /*
  The width of the card.
  */
  cardHeight: number;

  /* 
  The x coordinate range for card translation.
  */
  translateXRange: number[];

  /*
  The y coordinate range for card translation.
  */
  translateYRange: number[];

  /*
  The input and output ranges for card rotation.
  */
  inputRotationRange: number[];
  outputRotationRange: number[];

  /*
  The input and output ranges for swipe direction overlay label opacity.
  */

  inputOverlayLabelRightOpacityRange: number[];
  outputOverlayLabelRightOpacityRange: number[];

  inputOverlayLabelLeftOpacityRange: number[];
  outputOverlayLabelLeftOpacityRange: number[];

  inputOverlayLabelTopOpacityRange: number[];
  outputOverlayLabelTopOpacityRange: number[];

  /*
  Disable right, left, and top swipes.
  */
  disableRightSwipe: boolean;
  disableLeftSwipe: boolean;
  disableTopSwipe: boolean;

  /*
  The style of the card.
  */
  cardStyle: StyleProp<ViewStyle>;
  /*
  Callbacks for swipe events.
  */
  onSwipedRight: () => void;
  onSwipedLeft: () => void;
  onSwipedTop: () => void;

  /*
  The scale value for card animation.
  */
  scaleValue: number;

  /*  
  Swipe direction overlay label components.
  */
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
}>;
