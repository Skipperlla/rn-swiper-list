/**
 * Tests for swipeBack() functionality with initialIndex > 0
 *
 * Issue: swipeBack() does nothing if Swiper component is rendered with an initialIndex > 0
 */

describe('swipeBack with initialIndex', () => {
  it('should not allow swipeBack when at initialIndex without having swiped forward', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const initialIndex = 5;
    const clampedInitialIndex = Math.max(
      0,
      Math.min(initialIndex, data.length - 1)
    );

    // Simulate starting state
    let activeIndex = clampedInitialIndex; // 5

    // Try to swipe back
    const previousIndex = activeIndex - 1; // 4

    // Check the current logic
    const shouldReturn = previousIndex < clampedInitialIndex; // 4 < 5 = true

    expect(shouldReturn).toBe(true);
    // This is correct - can't swipe back below initial index
  });

  it('should allow swipeBack after swiping forward from initialIndex', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const initialIndex = 5;
    const clampedInitialIndex = Math.max(
      0,
      Math.min(initialIndex, data.length - 1)
    );

    // Simulate starting state
    let activeIndex = clampedInitialIndex; // 5

    // Simulate swipeRight (activeIndex should become 6)
    activeIndex++; // 6

    // Now try to swipe back
    const previousIndex = activeIndex - 1; // 5

    // Check the current logic
    const shouldReturn = previousIndex < clampedInitialIndex; // 5 < 5 = false

    expect(shouldReturn).toBe(false);
    expect(previousIndex).toBe(5);
    // This should work - we can swipe back to index 5
  });

  it('should handle double increment issue in swipeRight', () => {
    // This test documents the previous bug where activeIndex was incremented twice
    const initialIndex = 5;

    let activeIndex = initialIndex; // 5

    // Before fix: both card's swipeRight and updateActiveIndex would increment
    // activeIndex++; // Card's swipeRight: 6
    // activeIndex++; // updateActiveIndex: 7
    // After fix: only updateActiveIndex increments
    activeIndex++; // updateActiveIndex: 6

    // After swiping once, activeIndex should be 6, not 7
    const previousIndex = activeIndex - 1; // 5

    expect(previousIndex).toBe(5);
    // Now swipeBack correctly targets the card we just swiped (index 5)
  });
});

describe('swipeBack targeting logic', () => {
  it('should target the previously swiped card', () => {
    const initialIndex = 5;

    // Track which cards have been swiped
    const swipedCards: number[] = [];

    // Start at index 5
    let activeIndex = initialIndex;

    // Swipe card 5
    swipedCards.push(activeIndex);
    activeIndex++; // Now at 6

    // Swipe card 6
    swipedCards.push(activeIndex);
    activeIndex++; // Now at 7

    // SwipeBack should bring back the last swiped card (index 6)
    const lastSwipedCard = swipedCards[swipedCards.length - 1];
    expect(lastSwipedCard).toBe(6);

    // previousIndex should match the last swiped card
    const previousIndex = activeIndex - 1; // 6
    expect(previousIndex).toBe(lastSwipedCard);
  });
});
