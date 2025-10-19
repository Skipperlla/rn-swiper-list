import React, { useImperativeHandle, type ForwardedRef } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import type {
  SwiperCardRefType,
  SwiperOptions,
  SwiperCardOptions,
} from 'rn-swiper-list';

import useSwipeControls from './hooks/useSwipeControls';
import SwiperCard from './SwiperCard';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const SWIPE_SPRING_CONFIG: SpringConfig = {
  damping: 20,
  stiffness: 50,
  mass: 1,
  overshootClamping: true,
};

const Swiper = <T,>(
  {
    data,
    renderCard,
    prerenderItems = Math.min(Math.max(data.length - 1, 1), 3),
    onSwipeRight,
    onSwipeLeft,
    onSwipedAll,
    onSwipeTop,
    onSwipeBottom,
    onIndexChange,
    cardStyle,
    flippedCardStyle,
    regularCardStyle,
    disableRightSwipe,
    disableLeftSwipe,
    disableTopSwipe,
    disableBottomSwipe,
    translateXRange = [-windowWidth / 3, 0, windowWidth / 3],
    translateYRange = [-windowHeight / 3, 0, windowHeight / 3],
    rotateInputRange = [-windowWidth / 3, 0, windowWidth / 3],
    rotateOutputRange = [-Math.PI / 20, 0, Math.PI / 20],
    inputOverlayLabelRightOpacityRange = [0, windowWidth / 3],
    outputOverlayLabelRightOpacityRange = [0, 1],
    inputOverlayLabelLeftOpacityRange = [0, -(windowWidth / 3)],
    outputOverlayLabelLeftOpacityRange = [0, 1],
    inputOverlayLabelTopOpacityRange = [0, -(windowHeight / 3)],
    outputOverlayLabelTopOpacityRange = [0, 1],
    inputOverlayLabelBottomOpacityRange = [0, windowHeight / 3],
    outputOverlayLabelBottomOpacityRange = [0, 1],
    OverlayLabelRight,
    OverlayLabelLeft,
    OverlayLabelTop,
    OverlayLabelBottom,
    onSwipeStart,
    onSwipeActive,
    onSwipeEnd,
    swipeBackXSpringConfig = SWIPE_SPRING_CONFIG,
    swipeBackYSpringConfig = SWIPE_SPRING_CONFIG,
    swipeRightSpringConfig = SWIPE_SPRING_CONFIG,
    swipeLeftSpringConfig = SWIPE_SPRING_CONFIG,
    swipeTopSpringConfig = SWIPE_SPRING_CONFIG,
    swipeBottomSpringConfig = SWIPE_SPRING_CONFIG,
    loop = false,
    keyExtractor,
    onPress,
    swipeVelocityThreshold,
    FlippedContent,
    direction = 'y',
    flipDuration = 500,
    overlayLabelContainerStyle,
    initialIndex = 0,
  }: SwiperOptions<T>,
  ref: ForwardedRef<SwiperCardRefType>
) => {
  // Slice data from initialIndex to skip initial items
  const slicedData = data.slice(initialIndex);

  // Adjust prerenderItems based on sliced data length
  const adjustedPrerenderItems = Math.min(
    prerenderItems,
    Math.max(slicedData.length - 1, 1)
  );

  const {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeBack,
    swipeTop,
    swipeBottom,
    flipCard,
  } = useSwipeControls(slicedData, loop); // Always start from 0 with sliced data

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

  useAnimatedReaction(
    () => {
      return activeIndex.value >= slicedData.length;
    },
    (isSwipingFinished: boolean) => {
      if (isSwipingFinished && onSwipedAll) {
        runOnJS(onSwipedAll)();
      }
    },
    [slicedData]
  );

  //Listen to the activeIndex value
  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onIndexChange) {
        runOnJS(onIndexChange)(currentValue + initialIndex);
      }
    },
    []
  );

  const Card = SwiperCard as unknown as React.ComponentType<
    React.PropsWithChildren<SwiperCardOptions<T>> & {
      ref?: React.Ref<SwiperCardRefType>;
    }
  >;

  return slicedData
    .map((item, index) => {
      // Calculate the original index for keyExtractor
      const originalIndex = index + initialIndex;
      return (
        <Card
          key={keyExtractor ? keyExtractor(item, originalIndex) : originalIndex}
          cardStyle={cardStyle}
          flippedCardStyle={flippedCardStyle}
          regularCardStyle={regularCardStyle}
          index={index}
          prerenderItems={adjustedPrerenderItems}
          disableRightSwipe={disableRightSwipe}
          disableLeftSwipe={disableLeftSwipe}
          disableTopSwipe={disableTopSwipe}
          disableBottomSwipe={disableBottomSwipe}
          translateXRange={translateXRange}
          translateYRange={translateYRange}
          rotateOutputRange={rotateOutputRange}
          rotateInputRange={rotateInputRange}
          inputOverlayLabelRightOpacityRange={
            inputOverlayLabelRightOpacityRange
          }
          outputOverlayLabelRightOpacityRange={
            outputOverlayLabelRightOpacityRange
          }
          inputOverlayLabelLeftOpacityRange={inputOverlayLabelLeftOpacityRange}
          outputOverlayLabelLeftOpacityRange={
            outputOverlayLabelLeftOpacityRange
          }
          inputOverlayLabelTopOpacityRange={inputOverlayLabelTopOpacityRange}
          outputOverlayLabelTopOpacityRange={outputOverlayLabelTopOpacityRange}
          inputOverlayLabelBottomOpacityRange={
            inputOverlayLabelBottomOpacityRange
          }
          outputOverlayLabelBottomOpacityRange={
            outputOverlayLabelBottomOpacityRange
          }
          activeIndex={activeIndex}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelTop={OverlayLabelTop}
          OverlayLabelBottom={OverlayLabelBottom}
          ref={refs[index]}
          onSwipeRight={(cardIndex: number) => {
            onSwipeRight?.(cardIndex + initialIndex);
          }}
          onSwipeLeft={(cardIndex: number) => {
            onSwipeLeft?.(cardIndex + initialIndex);
          }}
          onSwipeTop={(cardIndex: number) => {
            onSwipeTop?.(cardIndex + initialIndex);
          }}
          onSwipeBottom={(cardIndex: number) => {
            onSwipeBottom?.(cardIndex + initialIndex);
          }}
          FlippedContent={FlippedContent}
          onSwipeStart={onSwipeStart}
          onSwipeActive={onSwipeActive}
          onSwipeEnd={onSwipeEnd}
          swipeBackXSpringConfig={swipeBackXSpringConfig}
          swipeBackYSpringConfig={swipeBackYSpringConfig}
          swipeRightSpringConfig={swipeRightSpringConfig}
          swipeLeftSpringConfig={swipeLeftSpringConfig}
          swipeTopSpringConfig={swipeTopSpringConfig}
          swipeBottomSpringConfig={swipeBottomSpringConfig}
          onPress={onPress}
          swipeVelocityThreshold={swipeVelocityThreshold}
          item={item}
          direction={direction}
          flipDuration={flipDuration}
          overlayLabelContainerStyle={overlayLabelContainerStyle}
        >
          {renderCard(item, index)}
        </Card>
      );
    })
    .reverse(); // to render cards in same hierarchy as their z-index
};

function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  //@ts-ignore
  return React.forwardRef(render) as any;
}

export default fixedForwardRef(Swiper);
