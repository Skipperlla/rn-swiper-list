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

  return data.map((item, index) => {
    return (
      <SwiperCard
        key={index}
        cardStyle={cardStyle}
        index={index}
        disableRightSwipe={disableRightSwipe}
        disableLeftSwipe={disableLeftSwipe}
        disableTopSwipe={disableTopSwipe}
        disableBottomSwipe={disableBottomSwipe}
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
