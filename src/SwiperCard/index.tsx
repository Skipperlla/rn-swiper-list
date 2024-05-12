import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  type PropsWithChildren,
} from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SwiperCardOptions, SwiperCardRefType } from 'rn-swiper-list';

import OverlayLabel from './OverlayLabel';

const SwipeableCard = forwardRef<
  SwiperCardRefType,
  PropsWithChildren<SwiperCardOptions>
>(
  (
    {
      index,
      activeIndex,
      onSwipeLeft,
      onSwipeRight,
      onSwipeTop,
      cardStyle,
      children,
      disableRightSwipe,
      disableLeftSwipe,
      disableTopSwipe,
      translateXRange,
      translateYRange,
      rotateInputRange,
      rotateOutputRange,
      inputOverlayLabelRightOpacityRange,
      outputOverlayLabelRightOpacityRange,
      inputOverlayLabelLeftOpacityRange,
      outputOverlayLabelLeftOpacityRange,
      inputOverlayLabelTopOpacityRange,
      outputOverlayLabelTopOpacityRange,
      OverlayLabelRight,
      OverlayLabelLeft,
      OverlayLabelTop,
      onSwipeStart,
      onSwipeActive,
      onSwipeEnd,
    },
    ref
  ) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const currentActiveIndex = useSharedValue(Math.floor(activeIndex.value));
    const nextActiveIndex = useSharedValue(Math.floor(activeIndex.value));

    const { width, height } = useWindowDimensions();
    const maxCardTranslation = width * 1.5;
    const maxCardTranslationY = height * 1.5;

    const swipeRight = useCallback(() => {
      onSwipeRight?.(index);
      translateX.value = withSpring(maxCardTranslation);
      activeIndex.value++;
    }, [index, activeIndex, maxCardTranslation, onSwipeRight, translateX]);

    const swipeLeft = useCallback(() => {
      onSwipeLeft?.(index);
      translateX.value = withSpring(-maxCardTranslation);
      activeIndex.value++;
    }, [index, activeIndex, maxCardTranslation, onSwipeLeft, translateX]);

    const swipeTop = useCallback(() => {
      onSwipeTop?.(index);
      translateY.value = withSpring(-maxCardTranslationY);
      activeIndex.value++;
    }, [index, activeIndex, maxCardTranslationY, onSwipeTop, translateY]);

    const swipeBack = useCallback(() => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }, [translateX, translateY]);

    useImperativeHandle(
      ref,
      () => {
        return {
          swipeLeft,
          swipeRight,
          swipeBack,
          swipeTop,
        };
      },
      [swipeLeft, swipeRight, swipeBack, swipeTop]
    );

    const inputRangeX = React.useMemo(() => {
      return translateXRange ?? [];
    }, [translateXRange]);
    const inputRangeY = React.useMemo(() => {
      return translateYRange ?? [];
    }, [translateYRange]);
    const rotateX = useDerivedValue(() => {
      return interpolate(
        translateX.value,
        rotateInputRange ?? [],
        rotateOutputRange ?? [],
        'clamp'
      );
    }, [inputRangeX]);

    const gesture = Gesture.Pan()
      .onBegin(() => {
        currentActiveIndex.value = Math.floor(activeIndex.value);
        if (onSwipeStart) runOnJS(onSwipeStart)();
      })
      .onUpdate((event) => {
        if (currentActiveIndex.value !== index) return;
        if (onSwipeActive) runOnJS(onSwipeActive)();

        translateX.value = event.translationX;
        translateY.value = event.translationY;
        if (height / 3 < Math.abs(event.translationY)) {
          nextActiveIndex.value = interpolate(
            translateY.value,
            inputRangeY,
            [
              currentActiveIndex.value + 1,
              currentActiveIndex.value,
              currentActiveIndex.value + 1,
            ],
            'clamp'
          );
          return;
        }

        nextActiveIndex.value = interpolate(
          translateX.value,
          inputRangeX,
          [
            currentActiveIndex.value + 1,
            currentActiveIndex.value,
            currentActiveIndex.value + 1,
          ],
          'clamp'
        );
      })
      .onFinalize((event) => {
        if (currentActiveIndex.value !== index) return;
        if (onSwipeEnd) runOnJS(onSwipeEnd)();
        if (nextActiveIndex.value === activeIndex.value + 1) {
          const sign = Math.sign(event.translationX);
          const signPositionY = Number.isInteger(
            interpolate(
              translateY.value,
              inputRangeY,
              [
                currentActiveIndex.value + 1,
                currentActiveIndex.value,
                currentActiveIndex.value + 1,
              ],
              'clamp'
            )
          );

          if (signPositionY && !disableTopSwipe) {
            runOnJS(swipeTop)();
            return;
          }

          if (!signPositionY) {
            if (sign === 1 && !disableRightSwipe) {
              runOnJS(swipeRight)();
              return;
            }
            if (sign === -1 && !disableLeftSwipe) {
              runOnJS(swipeLeft)();
              return;
            }
          }
        }
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      });

    const rCardStyle = useAnimatedStyle(() => {
      const opacity = withTiming(index - activeIndex.value < 5 ? 1 : 0);
      const scale = withTiming(1 - 0.07 * (index - activeIndex.value));
      return {
        opacity,
        position: 'absolute',
        zIndex: -index,
        transform: [
          { rotate: `${rotateX.value}rad` },

          { scale: scale },
          {
            translateX: translateX.value,
          },
          {
            translateY: translateY.value,
          },
        ],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[cardStyle, rCardStyle]}>
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
      </GestureDetector>
    );
  }
);

export default memo(SwipeableCard);
