import { createRef, useCallback, useMemo, type RefObject } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { SwiperCardRefType } from 'rn-swiper-list';

const useSwipeControls = <T>(data: T[], loop: boolean = false) => {
  const activeIndex = useSharedValue(0);

  const refs = useMemo(() => {
    let cardRefs: RefObject<SwiperCardRefType>[] = [];

    for (let i = 0; i < data.length; i++) {
      cardRefs.push(createRef<SwiperCardRefType>());
    }
    return cardRefs;
  }, [data]);

  const updateActiveIndex = useCallback(() => {
    if (loop && activeIndex.value >= data.length - 1) {
      for (let i = 0; i < data.length; i++) {
        refs[i]?.current?.swipeBack();
      }
      setTimeout(() => {
        activeIndex.value = 0;
      }, 100);
    } else {
      activeIndex.value++;
    }
  }, [activeIndex, data.length, loop, refs]);

  const swipeRight = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeRight();
    updateActiveIndex();
  }, [activeIndex.value, refs, updateActiveIndex]);

  const swipeTop = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeTop();
    updateActiveIndex();
  }, [activeIndex.value, refs, updateActiveIndex]);

  const swipeLeft = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeLeft();
    updateActiveIndex();
  }, [activeIndex.value, refs, updateActiveIndex]);

  const swipeBottom = useCallback(() => {
    if (!refs[activeIndex.value]) {
      return;
    }
    refs[activeIndex.value]?.current?.swipeBottom();
    updateActiveIndex();
  }, [activeIndex.value, refs, updateActiveIndex]);

  const swipeBack = useCallback(() => {
    const previousIndex = activeIndex.value - 1;

    if (!loop && (previousIndex < 0 || !refs[previousIndex])) {
      return;
    }

    // Handle looping for swipe back
    const targetIndex = previousIndex < 0 ? data.length - 1 : previousIndex;

    if (refs[targetIndex]) {
      refs[targetIndex]?.current?.swipeBack();
      activeIndex.value = targetIndex;
    }
  }, [activeIndex, refs, data.length, loop]);

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
