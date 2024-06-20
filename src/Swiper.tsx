import React, { useEffect, useImperativeHandle, useRef, type ForwardedRef } from 'react';
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
    cardStyle,
    disableRightSwipe,
    disableLeftSwipe,
    disableTopSwipe,
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
    OverlayLabelRight,
    OverlayLabelLeft,
    OverlayLabelTop,
    onSwipeStart,
    onSwipeActive,
    onSwipeEnd,
    chunkSize = 3,
  }: SwiperOptions<T>,
  ref: ForwardedRef<SwiperCardRefType>
) => {
  const { activeIndex, refs, swipeRight, swipeLeft, swipeBack, swipeTop } =
    useSwipeControls(data);

  const currentIndexRef = useRef(0);
  const visibleCardsRef = useRef(data.slice(0, chunkSize));

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

  useEffect(() => {
    visibleCardsRef.current = data.slice(0, chunkSize);
  }, [data]);

  const updateVisibleCards = () => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex >= data.length - chunkSize) {
      visibleCardsRef.current = data.slice(currentIndex, data.length);
    } else {
      visibleCardsRef.current = data.slice(currentIndex, currentIndex + chunkSize);
    }
  };

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

  return visibleCardsRef.current.map((item, index) => {
    const actualIndex = currentIndexRef.current + index;

    return (
      <SwiperCard
        key={actualIndex}
        cardStyle={cardStyle}
        index={actualIndex}
        disableRightSwipe={disableRightSwipe}
        disableLeftSwipe={disableLeftSwipe}
        disableTopSwipe={disableTopSwipe}
        translateXRange={translateXRange}
        translateYRange={translateYRange}
        rotateOutputRange={rotateOutputRange}
        rotateInputRange={rotateInputRange}
        inputOverlayLabelRightOpacityRange={inputOverlayLabelRightOpacityRange}
        outputOverlayLabelRightOpacityRange={
          outputOverlayLabelRightOpacityRange
        }
        inputOverlayLabelLeftOpacityRange={inputOverlayLabelLeftOpacityRange}
        outputOverlayLabelLeftOpacityRange={outputOverlayLabelLeftOpacityRange}
        inputOverlayLabelTopOpacityRange={inputOverlayLabelTopOpacityRange}
        outputOverlayLabelTopOpacityRange={outputOverlayLabelTopOpacityRange}
        activeIndex={activeIndex}
        OverlayLabelRight={OverlayLabelRight}
        OverlayLabelLeft={OverlayLabelLeft}
        OverlayLabelTop={OverlayLabelTop}
        ref={refs[actualIndex]}
        onSwipeRight={(cardIndex) => {
          onSwipeRight?.(cardIndex);
          if (currentIndexRef.current + chunkSize < data.length) {
            currentIndexRef.current += 1;
            updateVisibleCards();
          }
        }}
        onSwipeLeft={(cardIndex) => {
          onSwipeLeft?.(cardIndex);
          if (currentIndexRef.current + chunkSize < data.length) {
            currentIndexRef.current += 1;
            updateVisibleCards();
          }
        }}
        onSwipeTop={(cardIndex) => {
          onSwipeTop?.(cardIndex);
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
