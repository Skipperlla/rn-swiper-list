import React, { useImperativeHandle, type ForwardedRef } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import type { SwiperCardRefType, SwiperOptions } from 'rn-swiper-list';

import useSwipeControls from './hooks/useSwipeControls';
import SwiperCard from './SwiperCard';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const Swiper = <T,>(
  {
    data,
    renderCard,
    onSwipeRight,
    onSwipeLeft,
    onSwipedAll,
    onSwipeTop,
    onSwipeBottom,
    onIndexChange,
    cardStyle,
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
    chunkSize = 3,
  }: SwiperOptions<T>,
  ref: ForwardedRef<SwiperCardRefType>
) => {
  const {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeBack,
    swipeTop,
    swipeBottom,
  } = useSwipeControls(data);

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

  useAnimatedReaction(
    () => {
      return activeIndex.value >= data.length;
    },
    (isSwipingFinished: boolean) => {
      if (isSwipingFinished && onSwipedAll) {
        runOnJS(onSwipedAll)();
      }
    },
    [data]
  );

  //Listen to the activeIndex value
  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onIndexChange) {
        runOnJS(onIndexChange)(currentValue);
      }
    },
    []
  );

  const getVisibleRange = (currentIndex: number, totalLength: number) => {
    // Calculate the start of the current chunk
    const currentChunk = Math.floor(currentIndex / chunkSize);
    const start = Math.max(0, currentChunk * chunkSize);

    // Calculate how many chunks ahead we should render
    const remainingItems = totalLength - currentChunk * chunkSize;
    const chunksAhead = Math.min(2, Math.ceil(remainingItems / chunkSize));

    // Calculate the end index, ensuring we don't exceed the data length
    const end = Math.min(totalLength, start + chunksAhead * chunkSize);

    return { start, end };
  };

  return data
    .slice(
      getVisibleRange(activeIndex.value, data.length).start,
      getVisibleRange(activeIndex.value, data.length).end
    )
    .map((item, slicedIndex) => {
      const actualIndex =
        getVisibleRange(activeIndex.value, data.length).start + slicedIndex;
      return (
        <SwiperCard
          key={actualIndex}
          cardStyle={cardStyle}
          index={actualIndex}
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
          ref={refs[actualIndex]}
          onSwipeRight={(cardIndex) => {
            onSwipeRight?.(cardIndex);
          }}
          onSwipeLeft={(cardIndex) => {
            onSwipeLeft?.(cardIndex);
          }}
          onSwipeTop={(cardIndex) => {
            onSwipeTop?.(cardIndex);
          }}
          onSwipeBottom={(cardIndex) => {
            onSwipeBottom?.(cardIndex);
          }}
          onSwipeStart={onSwipeStart}
          onSwipeActive={onSwipeActive}
          onSwipeEnd={onSwipeEnd}
        >
          {renderCard(item, actualIndex)}
        </SwiperCard>
      );
    });
};

function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(render) as any;
}

export default fixedForwardRef(Swiper);
