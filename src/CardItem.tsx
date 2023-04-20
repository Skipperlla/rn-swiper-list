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

const CardItem = ({
  cardWidth,
  cardHeight,
  translateXRange,
  translateYRange,
  disableRightSwipe,
  disableTopSwipe,
  disableLeftSwipe,
  inputRotationRange,
  outputRotationRange,
  cardStyle,
  onSwipedRight,
  onSwipedLeft,
  onSwipedTop,
  children,
  scaleValue,
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
      if (scale.value !== 1)
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
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default CardItem;

CardItem.defaultProps = {
  cardWidth: windowWidth,
  cardHeight: windowHeight,

  translateXRange: [-windowWidth, 0, windowWidth],
  translateYRange: [-windowHeight, 0, windowHeight],

  inputRotationRange: [-windowWidth, 0, windowWidth],
  outputRotationRange: [-10, 0, 10],

  disableRightSwipe: false,
  disableLeftSwipe: false,
  disableTopSwipe: false,

  cardStyle: {},

  onSwipedRight: () => {},
  onSwipedLeft: () => {},
  onSwipedTop: () => {},

  scaleValue: 1,
};
