import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { snapPoint } from 'react-native-redash';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

// (windowWidth + cardWidth + 50)/2
const CardItem = ({ cardWidth = windowWidth, cardHeight = windowHeight }) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const side = (windowWidth + cardWidth + 50) / 2;
  const SNAP_POINTS = [-windowWidth / 2, 0, windowWidth / 2];
  console.log('side', side);
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      startX: number;
      startY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      x.value = translationX + ctx.startX;
      y.value = translationY + ctx.startY;
    },
    onEnd: ({ velocityX, velocityY }) => {
      // x.value = withSpring(0);
      // console.log(ctx);
      const dest = snapPoint(x.value, velocityX, SNAP_POINTS);
      console.log('dest', dest);
      if (dest > 0) {
        x.value = withSpring(windowWidth, { velocity: velocityX });
      } else if (dest === windowWidth / 2) {
        x.value = withSpring(-windowWidth, { velocity: velocityX });
      }

      y.value = withSpring(0, { velocity: velocityY });
      // x.value = dest;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
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
