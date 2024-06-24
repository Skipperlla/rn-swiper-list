import { createRef, useCallback, useMemo, type RefObject } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { SwiperCardRefType } from 'rn-swiper-list';

const useSwipeControls = <T>(data: T[]) => {
  const activeIndex = useSharedValue(0);

  const refs = useMemo(() => {
    let cardRefs: RefObject<SwiperCardRefType>[] = [];

    for (let i = 0; i < data.length; i++) {
      cardRefs.push(createRef<SwiperCardRefType>());
    }
    return cardRefs;
  }, [data]);

  const swipeRight = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeRight();
  }, [activeIndex.value, refs]);
  const swipeTop = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeTop();
  }, [activeIndex.value, refs]);

  const swipeLeft = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeLeft();
  }, [activeIndex.value, refs]);
  const swipeBottom = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeBottom();
  }, [activeIndex.value, refs]);

  const swipeBack = useCallback(() => {
    if (!refs[activeIndex.value - 1]) {
      return;
    }
    refs[activeIndex.value - 1]?.current?.swipeBack();
    activeIndex.value--;
  }, [activeIndex.value, refs]);

  return {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeBack,
    swipeTop,
    swipeBottom,
  };
};

export default useSwipeControls;
