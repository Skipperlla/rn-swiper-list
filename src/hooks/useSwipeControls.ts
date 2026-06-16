import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from 'react';
import { useSharedValue } from 'react-native-reanimated';

import type { SwiperCardInternalRefType } from '../internalTypes';

const useSwipeControls = <T>(
  data: T[],
  loop: boolean = false,
  initialIndex: number = 0,
  swipeBackStartIndex: number = initialIndex
) => {
  // Validate and clamp initialIndex to valid range
  const clampedInitialIndex = Math.max(
    0,
    Math.min(initialIndex, data.length - 1)
  );
  const clampedSwipeBackStartIndex = Math.max(
    0,
    Math.min(swipeBackStartIndex, clampedInitialIndex)
  );
  const activeIndex = useSharedValue(clampedInitialIndex);
  const dataLength = useRef(data.length);

  // Update data length ref when data changes

  useEffect(() => {
    dataLength.current = data.length;
  }, [data]);

  const refs = useMemo(() => {
    let cardRefs: RefObject<SwiperCardInternalRefType | null>[] = [];

    for (let i = 0; i < data.length; i++) {
      cardRefs.push(createRef<SwiperCardInternalRefType>());
    }
    return cardRefs;
  }, [data]);

  const updateActiveIndex = useCallback(() => {
    'worklet';
    if (loop && activeIndex.value >= dataLength.current - 1) {
      // Reset all cards to initial position for loop
      activeIndex.value = clampedInitialIndex;
      refs.forEach((ref) => {
        ref?.current?.resetAfterLoop();
      });
    } else {
      activeIndex.value++;
    }
  }, [activeIndex, loop, refs, clampedInitialIndex]);

  const swipeRight = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeRight(false);
  }, [refs, activeIndex]);

  const swipeTop = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeTop(false);
  }, [refs, activeIndex]);

  const swipeLeft = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeLeft(false);
  }, [refs, activeIndex]);

  const swipeBottom = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeBottom(false);
  }, [refs, activeIndex]);

  const flipCard = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.flipCard();
  }, [activeIndex, refs]);

  const swipeBack = useCallback(() => {
    const previousIndex = activeIndex.value - 1;

    if (
      !loop &&
      (previousIndex < clampedSwipeBackStartIndex || !refs[previousIndex])
    ) {
      return;
    }

    // Handle looping for swipe back
    const targetIndex =
      previousIndex < clampedSwipeBackStartIndex
        ? dataLength.current - 1
        : previousIndex;

    if (refs[targetIndex]) {
      refs[targetIndex]?.current?.swipeBack();
      activeIndex.value = targetIndex;
    }
  }, [activeIndex, refs, loop, clampedSwipeBackStartIndex]);

  return {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeBack,
    swipeTop,
    swipeBottom,
    flipCard,
  };
};

export default useSwipeControls;
