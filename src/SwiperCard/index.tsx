import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  type PropsWithChildren,
} from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SwiperCardOptions, SwiperCardRefType } from 'rn-swiper-list';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import OverlayLabel from './OverlayLabel';

const SwipeableCard = forwardRef(function SwipeableCard<T>(
  props: PropsWithChildren<SwiperCardOptions<T>>,
  ref: React.ForwardedRef<SwiperCardRefType>
) {
  const {
    index,
    item,
    activeIndex,
    prerenderItems = 5,
    onSwipeLeft,
    onSwipeRight,
    onSwipeTop,
    onSwipeBottom,
    cardStyle,
    flippedCardStyle,
    regularCardStyle,
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
    onPress,
    FlippedContent,
    direction = 'y',
    flipDuration = 2500,
    overlayLabelContainerStyle,
    swipeVelocityThreshold,
  } = props;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isFlipped = useSharedValue(false);
  // Check if FlippedContent is defined and not null
  const hasFlippedContent =
    FlippedContent !== undefined && FlippedContent !== null;

  // Don't access activeIndex.value during render - use 0 as initial value
  // These will be updated in gesture handlers
  const nextActiveIndex = useSharedValue(0);

  const { width, height } = useWindowDimensions();
  const maxCardTranslation = width * 1.5;
  const maxCardTranslationY = height * 1.5;

  const swipeRight = useCallback(() => {
    onSwipeRight?.(index);
    scheduleOnUI(() => {
      translateX.value = withSpring(maxCardTranslation, {
        ...swipeRightSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      activeIndex.value++;
    });
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
    scheduleOnUI(() => {
      translateX.value = withSpring(-maxCardTranslation, {
        ...swipeLeftSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      activeIndex.value++;
    });
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
    scheduleOnUI(() => {
      translateY.value = withSpring(-maxCardTranslationY, {
        ...swipeTopSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      activeIndex.value++;
    });
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
    scheduleOnUI(() => {
      translateY.value = withSpring(maxCardTranslationY, {
        ...swipeBottomSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      activeIndex.value++;
    });
  }, [
    index,
    activeIndex,
    maxCardTranslationY,
    onSwipeBottom,
    translateY,
    swipeBottomSpringConfig,
  ]);

  const swipeBack = useCallback(() => {
    scheduleOnUI(() => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      translateX.value = withSpring(0, {
        ...swipeBackXSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      translateY.value = withSpring(0, {
        ...swipeBackYSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
    });
  }, [translateX, translateY, swipeBackXSpringConfig, swipeBackYSpringConfig]);

  const flipCard = useCallback(() => {
    if (hasFlippedContent) {
      isFlipped.value = !isFlipped.value;
      return;
    }
  }, [isFlipped, hasFlippedContent]);

  useImperativeHandle(ref, () => {
    return {
      swipeLeft,
      swipeRight,
      swipeBack,
      swipeTop,
      swipeBottom,
      flipCard,
    };
  }, [swipeLeft, swipeRight, swipeBack, swipeTop, swipeBottom, flipCard]);

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

  const tap = Gesture.Tap().onEnd((_event, success) => {
    if (success && onPress) {
      scheduleOnRN(onPress);
    }
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      nextActiveIndex.value = Math.floor(activeIndex.value);
      if (onSwipeStart) scheduleOnRN(onSwipeStart);
    })
    .onUpdate((event) => {
      // Use activeIndex.value directly in worklet context
      const currentActive = Math.floor(activeIndex.value);
      if (currentActive !== index) return;
      if (onSwipeActive) scheduleOnRN(onSwipeActive);

      translateX.value = event.translationX;
      translateY.value = event.translationY;

      if (height / 3 < Math.abs(event.translationY)) {
        nextActiveIndex.value = interpolate(
          translateY.value,
          inputRangeY,
          [currentActive + 1, currentActive, currentActive + 1],
          'clamp'
        );
        return;
      }

      nextActiveIndex.value = interpolate(
        translateX.value,
        inputRangeX,
        [currentActive + 1, currentActive, currentActive + 1],
        'clamp'
      );
    })
    .onFinalize((event) => {
      const currentActive = Math.floor(activeIndex.value);
      if (currentActive !== index) return;
      if (onSwipeEnd) scheduleOnRN(onSwipeEnd);
      if (nextActiveIndex.value === activeIndex.value + 1) {
        const sign = Math.sign(event.translationX);
        const signY = Math.sign(event.translationY);
        const signPositionY = Number.isInteger(
          interpolate(
            translateY.value,
            inputRangeY,
            [currentActive + 1, currentActive, currentActive + 1],
            'clamp'
          )
        );
        if (signPositionY) {
          if (signY === -1 && !disableTopSwipe) {
            scheduleOnRN(swipeTop);
            return;
          }
          if (signY === 1 && !disableBottomSwipe) {
            scheduleOnRN(swipeBottom);
            return;
          }
        }

        if (!signPositionY) {
          if (sign === 1 && !disableRightSwipe) {
            scheduleOnRN(swipeRight);
            return;
          }
          if (sign === -1 && !disableLeftSwipe) {
            scheduleOnRN(swipeLeft);
            return;
          }
        }
      }
    })
    .onFinalize((event) => {
      const currentActive = Math.floor(activeIndex.value);
      if (currentActive !== index) return;
      if (onSwipeEnd) scheduleOnRN(onSwipeEnd);

      if (swipeVelocityThreshold !== undefined) {
        if (Math.abs(event.velocityX) > swipeVelocityThreshold) {
          const sign = Math.sign(event.velocityX);
          if (sign === -1 && !disableLeftSwipe) {
            scheduleOnRN(swipeLeft);
            return;
          }
          if (sign === 1 && !disableRightSwipe) {
            scheduleOnRN(swipeRight);
            return;
          }
        }

        if (Math.abs(event.velocityY) > swipeVelocityThreshold) {
          const sign = Math.sign(event.velocityY);
          if (sign === -1 && !disableTopSwipe) {
            scheduleOnRN(swipeTop);
            return;
          }
          if (sign === 1 && !disableBottomSwipe) {
            scheduleOnRN(swipeBottom);
            return;
          }
        }
      }

      if (nextActiveIndex.value === activeIndex.value + 1) {
        const sign = Math.sign(event.translationX);
        const signY = Math.sign(event.translationY);
        const signPositionY = Number.isInteger(
          interpolate(
            translateY.value,
            inputRangeY,
            [currentActive + 1, currentActive, currentActive + 1],
            'clamp'
          )
        );

        if (signPositionY) {
          if (signY === -1 && !disableTopSwipe) {
            scheduleOnRN(swipeTop);
            return;
          }
          if (signY === 1 && !disableBottomSwipe) {
            scheduleOnRN(swipeBottom);
            return;
          }
        }

        if (!signPositionY) {
          if (sign === 1 && !disableRightSwipe) {
            scheduleOnRN(swipeRight);
            return;
          }
          if (sign === -1 && !disableLeftSwipe) {
            scheduleOnRN(swipeLeft);
            return;
          }
        }
      }
      translateX.value = withSpring(0, {
        ...swipeBackXSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
      translateY.value = withSpring(0, {
        ...swipeBackYSpringConfig,
        reduceMotion: ReduceMotion.Never,
      });
    });

  const rCardStyle = useAnimatedStyle(() => {
    // Handle visibility and rendering based on prerenderItems using animated values
    // Don't access activeIndex.value directly - use derived values instead
    const currentActive = Math.floor(activeIndex.value);
    const shouldRender =
      index < currentActive + prerenderItems && index >= currentActive - 1;
    const indexDiff = index - currentActive;

    const opacity = withTiming(
      shouldRender && indexDiff < prerenderItems ? 1 : 0,
      { reduceMotion: ReduceMotion.Never }
    );
    const scale = withTiming(1 - 0.07 * indexDiff, {
      reduceMotion: ReduceMotion.Never,
    });

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

  const isDirectionX = direction === 'x';
  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, {
      duration: flipDuration,
      reduceMotion: ReduceMotion.Never,
    });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
      position: 'absolute',
      backfaceVisibility: 'hidden',
      zIndex: isFlipped.value ? 1 : 2,
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, {
      duration: flipDuration,
      reduceMotion: ReduceMotion.Never,
    });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
      backfaceVisibility: 'hidden',
      zIndex: isFlipped.value ? 2 : 1,
    };
  });

  const composed = Gesture.Race(tap, pan);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[rCardStyle, cardStyle]}>
        {OverlayLabelLeft && (
          <OverlayLabel
            overlayLabelContainerStyle={overlayLabelContainerStyle}
            inputRange={inputOverlayLabelLeftOpacityRange}
            outputRange={outputOverlayLabelLeftOpacityRange}
            Component={OverlayLabelLeft}
            opacityValue={translateX}
          />
        )}
        {OverlayLabelRight && (
          <OverlayLabel
            overlayLabelContainerStyle={overlayLabelContainerStyle}
            inputRange={inputOverlayLabelRightOpacityRange}
            outputRange={outputOverlayLabelRightOpacityRange}
            Component={OverlayLabelRight}
            opacityValue={translateX}
          />
        )}
        {OverlayLabelTop && (
          <OverlayLabel
            overlayLabelContainerStyle={overlayLabelContainerStyle}
            inputRange={inputOverlayLabelTopOpacityRange}
            outputRange={outputOverlayLabelTopOpacityRange}
            Component={OverlayLabelTop}
            opacityValue={translateY}
          />
        )}
        {OverlayLabelBottom && (
          <OverlayLabel
            overlayLabelContainerStyle={overlayLabelContainerStyle}
            inputRange={inputOverlayLabelBottomOpacityRange}
            outputRange={outputOverlayLabelBottomOpacityRange}
            Component={OverlayLabelBottom}
            opacityValue={translateY}
          />
        )}
        <Animated.View
          style={[
            StyleSheet.flatten([regularCardStyle, cardStyle]),
            regularCardAnimatedStyle,
          ]}
        >
          {children}
        </Animated.View>
        {hasFlippedContent && (
          <Animated.View
            style={[
              StyleSheet.flatten([flippedCardStyle, cardStyle]),
              flippedCardAnimatedStyle,
            ]}
          >
            {FlippedContent(item, index)}
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

export default memo(SwipeableCard) as typeof SwipeableCard;
