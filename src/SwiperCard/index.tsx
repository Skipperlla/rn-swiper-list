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
      onSwipeBottom,
      cardStyle,
      children,
      disableRightSwipe,
      disableLeftSwipe,
      disableTopSwipe,
      disableBottomSwipe,
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
      inputOverlayLabelBottomOpacityRange,
      outputOverlayLabelBottomOpacityRange,
      OverlayLabelRight,
      OverlayLabelLeft,
      OverlayLabelTop,
      OverlayLabelBottom,
      onSwipeStart,
      onSwipeActive,
      onSwipeEnd,
      swipeBackXSpringConfig,
      swipeBackYSpringConfig,
      swipeRightSpringConfig,
      swipeLeftSpringConfig,
      swipeTopSpringConfig,
      swipeBottomSpringConfig,
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
      translateX.value = withSpring(maxCardTranslation, swipeRightSpringConfig);
      activeIndex.value++;
    }, [
      index,
      activeIndex,
      maxCardTranslation,
      onSwipeRight,
      translateX,
      swipeRightSpringConfig,
    ]);

    const swipeLeft = useCallback(() => {
      onSwipeLeft?.(index);
      translateX.value = withSpring(-maxCardTranslation, swipeLeftSpringConfig);
      activeIndex.value++;
    }, [
      index,
      activeIndex,
      maxCardTranslation,
      onSwipeLeft,
      translateX,
      swipeLeftSpringConfig,
    ]);

    const swipeTop = useCallback(() => {
      onSwipeTop?.(index);
      translateY.value = withSpring(-maxCardTranslationY, swipeTopSpringConfig);
      activeIndex.value++;
    }, [
      index,
      activeIndex,
      maxCardTranslationY,
      onSwipeTop,
      translateY,
      swipeTopSpringConfig,
    ]);

    const swipeBottom = useCallback(() => {
      onSwipeBottom?.(index);
      translateY.value = withSpring(
        maxCardTranslationY,
        swipeBottomSpringConfig
      );
      activeIndex.value++;
    }, [
      index,
      activeIndex,
      maxCardTranslationY,
      onSwipeBottom,
      translateY,
      swipeBottomSpringConfig,
    ]);

    const swipeBack = useCallback(() => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      translateX.value = withSpring(0, swipeBackXSpringConfig);
      translateY.value = withSpring(0, swipeBackYSpringConfig);
    }, [
      translateX,
      translateY,
      swipeBackXSpringConfig,
      swipeBackYSpringConfig,
    ]);

    useImperativeHandle(
      ref,
      () => {
        return {
          swipeLeft,
          swipeRight,
          swipeBack,
          swipeTop,
          swipeBottom,
        };
      },
      [swipeLeft, swipeRight, swipeBack, swipeTop, swipeBottom]
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
          const signY = Math.sign(event.translationY);
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

          if (signPositionY) {
            if (signY === -1 && !disableTopSwipe) {
              runOnJS(swipeTop)();
              return;
            }
            if (signY === 1 && !disableBottomSwipe) {
              runOnJS(swipeBottom)();
              return;
            }
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
        translateX.value = withSpring(0, swipeBackXSpringConfig);
        translateY.value = withSpring(0, swipeBackYSpringConfig);
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
      </GestureDetector>
    );
  }
);

export default memo(SwipeableCard);
