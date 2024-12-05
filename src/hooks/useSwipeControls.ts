import {
  createRef,
  type RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import type { SwiperCardRefType } from 'rn-swiper-list';

const useSwipeControls = <T>(data: T[]) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const refs = useMemo(() => {
    const cardRefs: RefObject<SwiperCardRefType>[] = [];
    for (let i = 0; i < data.length; i++) {
      cardRefs.push(createRef<SwiperCardRefType>());
    }
    return cardRefs;
  }, [data]);

  const swipeRight = useCallback(() => {
    refs[activeIndex]?.current?.swipeRight();
    setActiveIndex((prev) => Math.min(prev + 1, data.length - 1));
  }, [activeIndex, refs, data.length]);

  const swipeLeft = useCallback(() => {
    refs[activeIndex]?.current?.swipeLeft();
    setActiveIndex((prev) => Math.min(prev + 1, data.length - 1));
  }, [activeIndex, refs, data.length]);

  const swipeTop = useCallback(() => {
    refs[activeIndex]?.current?.swipeTop();
    setActiveIndex((prev) => Math.min(prev + 1, data.length - 1));
  }, [activeIndex, refs, data.length]);

  const swipeBottom = useCallback(() => {
    refs[activeIndex]?.current?.swipeBottom();
    setActiveIndex((prev) => Math.min(prev + 1, data.length - 1));
  }, [activeIndex, refs, data.length]);

  const swipeBack = useCallback(() => {
    if (activeIndex > 0) {
      const previousIndex = activeIndex - 1;
      refs[previousIndex]?.current?.swipeBack();
      setActiveIndex(previousIndex);
    }
  }, [activeIndex, refs]);

  const updateActiveIndex = useCallback(
    (newIndex: number) => {
      setActiveIndex((prev) =>
        newIndex >= 0 && newIndex < data.length ? newIndex : prev
      );
    },
    [data.length]
  );

  return {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeTop,
    swipeBottom,
    swipeBack,
    updateActiveIndex,
  };
};

export default useSwipeControls;
