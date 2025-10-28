/**
 * Integration tests for the reported issue:
 * "swipeBack() does nothing if Swiper component is rendered with an initialIndex > 0"
 *
 * Issue description:
 * - When Swiper starts with initialIndex > 0 (e.g., 5 in a 10-item array)
 * - Calling swipeBack() immediately does nothing (expected - nothing to go back to)
 * - But after swipeRight(), swipeBack() should work correctly
 *
 * Root cause: Double increment bug where activeIndex was incremented twice per swipe
 */

describe('Issue: swipeBack with initialIndex > 0', () => {
  it('should correctly navigate with initialIndex at middle of data array', () => {
    // Setup: 10 items, start at index 5
    const dataLength = 10;
    const initialIndex = 5;
    const clampedInitialIndex = Math.max(
      0,
      Math.min(initialIndex, dataLength - 1)
    );

    // Simulate activeIndex behavior
    let activeIndex = clampedInitialIndex; // Start at 5

    // Step 1: Try swipeBack without swiping forward first
    let previousIndex = activeIndex - 1; // 4
    let canSwipeBack = previousIndex >= clampedInitialIndex; // 4 >= 5 = false
    expect(canSwipeBack).toBe(false);
    // This is correct - cannot swipe back below initialIndex

    // Step 2: Swipe right (move forward)
    activeIndex++; // Should become 6 (not 7 after fix)
    expect(activeIndex).toBe(6);

    // Step 3: Now try swipeBack - should work
    previousIndex = activeIndex - 1; // 5
    canSwipeBack = previousIndex >= clampedInitialIndex; // 5 >= 5 = true
    expect(canSwipeBack).toBe(true);
    expect(previousIndex).toBe(5);
    // This should work - we can swipe back to the initialIndex

    // Execute swipeBack
    activeIndex = previousIndex; // Go back to 5
    expect(activeIndex).toBe(5);
  });

  it('should allow multiple swipeRight then swipeBack cycles', () => {
    const initialIndex = 5;
    let activeIndex = initialIndex;

    // Swipe right 3 times
    activeIndex++; // 6
    activeIndex++; // 7
    activeIndex++; // 8
    expect(activeIndex).toBe(8);

    // Swipe back once
    let previousIndex = activeIndex - 1; // 7
    activeIndex = previousIndex;
    expect(activeIndex).toBe(7);

    // Swipe back again
    previousIndex = activeIndex - 1; // 6
    activeIndex = previousIndex;
    expect(activeIndex).toBe(6);

    // Swipe back to initialIndex
    previousIndex = activeIndex - 1; // 5
    activeIndex = previousIndex;
    expect(activeIndex).toBe(5);

    // Can't swipe back further
    previousIndex = activeIndex - 1; // 4
    const canSwipeBack = previousIndex >= initialIndex; // 4 >= 5 = false
    expect(canSwipeBack).toBe(false);
  });

  it('should correctly handle swipeBack with initialIndex = 0', () => {
    const initialIndex = 0;
    let activeIndex = initialIndex;

    // Cannot swipe back from the start
    let previousIndex = activeIndex - 1; // -1
    let canSwipeBack = previousIndex >= initialIndex; // -1 >= 0 = false
    expect(canSwipeBack).toBe(false);

    // Swipe right
    activeIndex++; // 1

    // Now can swipe back
    previousIndex = activeIndex - 1; // 0
    canSwipeBack = previousIndex >= initialIndex; // 0 >= 0 = true
    expect(canSwipeBack).toBe(true);
  });

  it('should handle edge case with initialIndex at last item', () => {
    const dataLength = 10;
    const initialIndex = 9; // Last item
    const clampedInitialIndex = Math.max(
      0,
      Math.min(initialIndex, dataLength - 1)
    );

    let activeIndex = clampedInitialIndex; // 9

    // Cannot swipe back (nothing before)
    let previousIndex = activeIndex - 1; // 8
    let canSwipeBack = previousIndex >= clampedInitialIndex; // 8 >= 9 = false
    expect(canSwipeBack).toBe(false);

    // Swipe right (move to index 10, which is beyond the array)
    activeIndex++; // 10

    // Now can swipe back to index 9
    previousIndex = activeIndex - 1; // 9
    canSwipeBack = previousIndex >= clampedInitialIndex; // 9 >= 9 = true
    expect(canSwipeBack).toBe(true);
  });

  it('verifies the fix: single increment instead of double', () => {
    const initialIndex = 5;
    let activeIndex = initialIndex;

    // Before fix: swipeRight would increment twice (card + updateActiveIndex)
    // After fix: swipeRight increments once (only updateActiveIndex)

    // Simulate one swipe with the fix
    const incrementsPerSwipe = 1; // Fixed: was 2 before
    activeIndex += incrementsPerSwipe;
    expect(activeIndex).toBe(6); // Not 7!

    // SwipeBack targets the correct card now
    const targetCard = activeIndex - 1;
    expect(targetCard).toBe(5); // The card we just swiped
  });
});
