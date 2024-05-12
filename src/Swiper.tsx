import React, { useImperativeHandle, type ForwardedRef } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import type { SwiperCardRefType, SwiperOptions } from 'rn-tinder-swiper';

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
  }: SwiperOptions<T>,
  ref: ForwardedRef<SwiperCardRefType>
) => {
  const { activeIndex, refs, swipeRight, swipeLeft, swipeBack, swipeTop } =
    useSwipeControls(data);

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

  return data.map((item, index) => {
    return (
      <SwiperCard
        key={index}
        cardStyle={cardStyle}
        index={index}
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
        ref={refs[index]}
        onSwipeRight={(cardIndex) => {
          onSwipeRight?.(cardIndex);
        }}
        onSwipeLeft={(cardIndex) => {
          onSwipeLeft?.(cardIndex);
        }}
        onSwipeTop={(cardIndex) => {
          onSwipeTop?.(cardIndex);
        }}
        onSwipeStart={onSwipeStart}
        onSwipeActive={onSwipeActive}
        onSwipeEnd={onSwipeEnd}
      >
        {renderCard(item, index)}
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
