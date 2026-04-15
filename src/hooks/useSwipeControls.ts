import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { SwiperCardRefType } from 'rn-swiper-list';

const useSwipeControls = <T>(
  data: T[],
  loop: boolean = false,
  initialIndex: number = 0
) => {
  // Validate and clamp initialIndex to valid range
  const clampedInitialIndex = Math.max(
    0,
    Math.min(initialIndex, data.length - 1)
  );
  const activeIndex = useSharedValue(clampedInitialIndex);
  const dataLength = useRef(data.length);

  // Update data length ref when data changes
  useEffect(() => {
    dataLength.current = data.length;
  }, [data]);

  const refs = useMemo(() => {
    let cardRefs: RefObject<SwiperCardRefType | null>[] = [];

    for (let i = 0; i < data.length; i++) {
      cardRefs.push(createRef<SwiperCardRefType>());
    }
    return cardRefs;
  }, [data]);

  // NOTE: Each card's swipeRight/Left/Top/Bottom already increments
  // `activeIndex` on the UI thread inside its own `scheduleOnUI` block.
  // The programmatic methods below must therefore NOT increment again,
  // otherwise `activeIndex` advances by 2 per call (see issue #67).
  const swipeRight = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeRight();
  }, [refs, activeIndex]);

  const swipeTop = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeTop();
  }, [refs, activeIndex]);

  const swipeLeft = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeLeft();
  }, [refs, activeIndex]);

  const swipeBottom = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeBottom();
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
      (previousIndex < clampedInitialIndex || !refs[previousIndex])
    ) {
      return;
    }

    // Handle looping for swipe back
    const targetIndex =
      previousIndex < clampedInitialIndex
        ? dataLength.current - 1
        : previousIndex;

    if (refs[targetIndex]) {
      refs[targetIndex]?.current?.swipeBack();
      activeIndex.value = targetIndex;
    }
  }, [activeIndex, refs, loop, clampedInitialIndex]);

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
