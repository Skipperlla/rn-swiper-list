import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { TinderCardOptions } from 'rn-tinder-card';

import { resetPosition, updatePosition, snapPoint } from './utils';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

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
}: TinderCardOptions) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
      else if (positiveY > positiveX && destY && !disableTopSwipe)
        translateY.value = withSpring(-windowHeight, {
          velocity: velocityY,
        });
      else
        updatePosition(
          destX,
          disableRightSwipe,
          translateX,
          cardWidth,
          velocityX,
          disableLeftSwipe,
          translateY
        );
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
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: 'red',
          },
          animatedStyle,
        ]}
      />
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

  // onSwipedRight: (cardIndex: number) => {
  //   return cardIndex;
  // },
  // onSwipedLeft: (cardIndex: number) => {
  //   return cardIndex;
  // },
  // onSwipedTop: (cardIndex: number) => {
  //   return cardIndex;
  // },
};
