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
// Helper to clamp initialIndex to valid range
function clampInitialIndex(initialIndex: number, dataLength: number): number {
  return Math.max(0, Math.min(initialIndex, Math.max(0, dataLength - 1)));
}

const useSwipeControls = <T>(
  data: T[],
  loop: boolean = false,
  initialIndex: number = 0
) => {
  // Validate and clamp initialIndex to valid range
  const validInitialIndex = clampInitialIndex(initialIndex, data.length);
  const activeIndex = useSharedValue(validInitialIndex);
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

  const updateActiveIndex = useCallback(() => {
    'worklet';
    if (loop && activeIndex.value >= dataLength.current - 1) {
      // Reset all cards to initial position for loop
      activeIndex.value = 0;
      refs.forEach((ref) => {
        ref?.current?.swipeBack();
      });
    } else {
      activeIndex.value++;
    }
  }, [activeIndex, loop, refs]);

  const swipeRight = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeRight();
    updateActiveIndex();
  }, [refs, updateActiveIndex, activeIndex]);

  const swipeTop = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeTop();
    updateActiveIndex();
  }, [refs, updateActiveIndex, activeIndex]);

  const swipeLeft = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeLeft();
    updateActiveIndex();
  }, [refs, updateActiveIndex, activeIndex]);

  const swipeBottom = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.swipeBottom();
    updateActiveIndex();
  }, [refs, updateActiveIndex, activeIndex]);

  const flipCard = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex]?.current?.flipCard();
  }, [activeIndex, refs]);

  const swipeBack = useCallback(() => {
    const previousIndex = activeIndex.value - 1;

    if (!loop && (previousIndex < 0 || !refs[previousIndex])) {
      return;
    }

    // Handle looping for swipe back
    const targetIndex =
      previousIndex < 0 ? dataLength.current - 1 : previousIndex;

    if (refs[targetIndex]) {
      refs[targetIndex]?.current?.swipeBack();
      activeIndex.value = targetIndex;
    }
  }, [activeIndex, refs, loop]);

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
