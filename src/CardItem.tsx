import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  PropsWithRef,
} from 'react';
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
import { CardItemHandle, TinderCardOptions } from 'rn-tinder-card';

import {
  resetPosition,
  updatePosition,
  snapPoint,
  windowWidth,
  windowHeight,
  userConfig,
} from './utils';
import OverlayLabel from './components/OverlayLabel';

const CardItem = forwardRef<CardItemHandle, PropsWithRef<TinderCardOptions>>(
  (
    {
      cardWidth,
      cardHeight,
      translateXRange,
      translateYRange,
      cardStyle,
      scaleValue,
      onSwipedLeft,
      onSwipedRight,
      onSwipedTop,
      onSwipedBottom,
      disableRightSwipe,
      disableTopSwipe,
      disableLeftSwipe,
      disableBottomSwipe,
      inputRotationRange,
      outputRotationRange,
      inputOverlayLabelRightOpacityRange,
      outputOverlayLabelRightOpacityRange,
      inputOverlayLabelLeftOpacityRange,
      outputOverlayLabelLeftOpacityRange,
      inputOverlayLabelTopOpacityRange,
      outputOverlayLabelTopOpacityRange,
      inputOverlayLabelBottomOpacityRange,
      outputOverlayLabelBottomOpacityRange,
      OverlayLabelRight,
      OverlayLabelLeft,
      OverlayLabelTop,
      OverlayLabelBottom,
      children,
    },
    ref
  ) => {
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
          scale.value = withTiming(Number(scaleValue), {
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

        const destX = snapPoint(
          translateX.value,
          velocityX,
          translateXRange ?? []
        );
        const destY = snapPoint(
          translateY.value,
          velocityY,
          translateYRange ?? []
        );

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
          onSwipedTop && runOnJS(onSwipedTop)();
        } else if (
          positiveY > positiveX &&
          destY &&
          !disableBottomSwipe &&
          Math.sign(translationY) === 1
        ) {
          translateY.value = withSpring(windowHeight, {
            velocity: velocityY,
          });
          onSwipedBottom && runOnJS(onSwipedBottom)();
        } else
          updatePosition(
            destX,
            translateX,
            translateY,
            cardWidth,
            velocityX,
            disableRightSwipe,
            disableLeftSwipe,
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
        inputRotationRange ?? [],
        outputRotationRange ?? [],
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

    // Add the swipeBack method
    const swipeBack = useCallback(() => {
      translateY.value = withSpring(0, userConfig);
      translateX.value = withSpring(0, userConfig);
    }, [translateY, translateX]);

    const swipeRight = useCallback(() => {
      translateY.value = withSpring(0, userConfig);
      const destX = snapPoint(windowWidth, 100, translateXRange ?? []);

      updatePosition(
        destX,
        translateX,
        translateY,
        cardWidth,
        100,
        disableRightSwipe,
        disableLeftSwipe,
        onSwipedRight,
        onSwipedLeft
      );
    }, [
      translateY,
      translateX,
      translateXRange,
      cardWidth,
      disableRightSwipe,
      disableLeftSwipe,
      onSwipedRight,
      onSwipedLeft,
    ]);

    const swipeLeft = useCallback(() => {
      translateY.value = withSpring(0, userConfig);
      const destX = snapPoint(-windowWidth, -100, translateXRange ?? []);

      updatePosition(
        destX,
        translateX,
        translateY,
        cardWidth,

        -100,
        disableRightSwipe,
        disableLeftSwipe,
        onSwipedRight,
        onSwipedLeft
      );
    }, [
      translateY,
      translateX,
      translateXRange,
      cardWidth,
      disableRightSwipe,
      disableLeftSwipe,
      onSwipedRight,
      onSwipedLeft,
    ]);

    const swipeTop = useCallback(() => {
      translateY.value = withSpring(-windowHeight, userConfig);
      onSwipedTop && runOnJS(onSwipedTop)();
    }, [translateY, onSwipedTop]);

    const swipeBottom = useCallback(() => {
      translateY.value = withSpring(windowHeight, userConfig);
      onSwipedBottom && runOnJS(onSwipedBottom)();
    }, [translateY, onSwipedBottom]);

    // Expose the swipeBack method using useImperativeHandle
    useImperativeHandle(ref, () => ({
      swipeBack: () => swipeBack(),
      swipeRight: () => swipeRight(),
      swipeLeft: () => swipeLeft(),
      swipeTop: () => swipeTop(),
      swipeBottom: () => swipeBottom(),
    }));

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
          {OverlayLabelBottom && (
            <OverlayLabel
              inputRange={inputOverlayLabelBottomOpacityRange}
              outputRange={outputOverlayLabelBottomOpacityRange}
              Component={OverlayLabelBottom}
              opacityValue={translateY}
            />
          )}

          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

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
  onSwipedBottom: () => {},

  //* Swipe Animation Props
  disableRightSwipe: false,
  disableLeftSwipe: false,
  disableTopSwipe: false,
  disableBottomSwipe: false,
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

  inputOverlayLabelBottomOpacityRange: [0, windowHeight / 2],
  outputOverlayLabelBottomOpacityRange: [0, 1],
};
