import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolation,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { TinderCardOptions } from 'rn-tinder-card';

import {
  resetPosition,
  updatePosition,
  snapPoint,
  windowWidth,
  windowHeight,
} from './utils';
import OverlayLabel from './components/OverlayLabel';

const CardItem = ({
  cardWidth,
  cardHeight,
  translateXRange,
  translateYRange,
  cardStyle,
  scaleValue,
  onSwipedLeft,
  onSwipedRight,
  onSwipedTop,
  disableRightSwipe,
  disableTopSwipe,
  disableLeftSwipe,
  inputRotationRange,
  outputRotationRange,
  inputOverlayLabelRightOpacityRange,
  outputOverlayLabelRightOpacityRange,
  inputOverlayLabelLeftOpacityRange,
  outputOverlayLabelLeftOpacityRange,
  inputOverlayLabelTopOpacityRange,
  outputOverlayLabelTopOpacityRange,
  OverlayLabelRight,
  OverlayLabelLeft,
  OverlayLabelTop,
  children,
}: TinderCardOptions) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      startX: number;
      startY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;

      if (scaleValue !== 1)
        scale.value = withTiming(scaleValue, {
          easing: Easing.inOut(Easing.ease),
        });
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translateX.value = translationX + ctx.startX;
      translateY.value = translationY + ctx.startY;
    },
    onEnd: ({ velocityX, velocityY, translationX, translationY }) => {
      const positiveX = Math.abs(translationX);
      const positiveY = Math.abs(translationY);

      const destX = snapPoint(translateX.value, velocityX, translateXRange);
      const destY = snapPoint(translateY.value, velocityY, translateYRange);

      if (!destX && !destY) resetPosition(translateX, translateY);
      else if (
        positiveY > positiveX &&
        destY &&
        !disableTopSwipe &&
        Math.sign(translationY) === -1
      ) {
        translateY.value = withSpring(-windowHeight, {
          velocity: velocityY,
        });
        runOnJS(onSwipedTop)();
      } else
        updatePosition(
          destX,
          disableRightSwipe,
          translateX,
          cardWidth,
          velocityX,
          disableLeftSwipe,
          translateY,
          onSwipedRight,
          onSwipedLeft
        );

      if (scaleValue !== 1)
        scale.value = withTiming(1, {
          easing: Easing.inOut(Easing.ease),
        });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translationX = interpolate(
      translateX.value,
      inputRotationRange,
      outputRotationRange,
      {
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          rotate: `${translationX}deg`,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          cardStyle,
          {
            width: cardWidth,
            height: cardHeight,
          },
          animatedStyle,
        ]}
      >
        {OverlayLabelLeft && (
          <OverlayLabel
            inputRange={inputOverlayLabelLeftOpacityRange}
            outputRange={outputOverlayLabelLeftOpacityRange}
            Component={OverlayLabelLeft}
            opacityValue={translateX}
          />
        )}
        {OverlayLabelRight && (
          <OverlayLabel
            inputRange={inputOverlayLabelRightOpacityRange}
            outputRange={outputOverlayLabelRightOpacityRange}
            Component={OverlayLabelRight}
            opacityValue={translateX}
          />
        )}
        {OverlayLabelTop && (
          <OverlayLabel
            inputRange={inputOverlayLabelTopOpacityRange}
            outputRange={outputOverlayLabelTopOpacityRange}
            Component={OverlayLabelTop}
            opacityValue={translateY}
          />
        )}

        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default CardItem;

CardItem.defaultProps = {
  //* Card Props
  cardWidth: windowWidth,
  cardHeight: windowHeight,
  translateXRange: [-windowWidth / 2, 0, windowWidth / 2],
  translateYRange: [-windowHeight / 2, 0, windowHeight / 2],
  cardStyle: {},
  scaleValue: 1,
  //* Event callbacks
  onSwipedRight: () => {},
  onSwipedLeft: () => {},
  onSwipedTop: () => {},
  //* Swipe Animation Props
  disableRightSwipe: false,
  disableLeftSwipe: false,
  disableTopSwipe: false,
  //* Rotation Animation Props
  inputRotationRange: [-windowWidth, 0, windowWidth],
  outputRotationRange: [-10, 0, 10],
  //* Overlay Labels Animation Props
  inputOverlayLabelRightOpacityRange: [0, windowWidth / 2],
  outputOverlayLabelRightOpacityRange: [0, 1],

  inputOverlayLabelLeftOpacityRange: [0, -windowWidth / 2],
  outputOverlayLabelLeftOpacityRange: [0, 1],

  inputOverlayLabelTopOpacityRange: [0, -windowHeight / 2],
  outputOverlayLabelTopOpacityRange: [0, 1],
};
