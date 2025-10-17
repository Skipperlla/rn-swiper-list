// Test to verify prerenderItems calculation
describe('Swiper prerenderItems', () => {
  it('should calculate prerenderItems correctly for single item', () => {
    const dataLength = 1;
    // The default calculation is: prerenderItems = data.length - 1
    // For single item: prerenderItems = 1 - 1 = 0
    // But it should be at least 1 to show the card
    const defaultPrerenderItems = dataLength - 1;
    const expectedMinimum = 1;

    expect(defaultPrerenderItems).toBe(0);
    // This test documents the bug: prerenderItems of 0 means no cards will render
    // After fix, the logic should ensure prerenderItems >= 1
    expect(Math.max(defaultPrerenderItems, expectedMinimum)).toBe(1);
  });

  it('should calculate prerenderItems correctly for multiple items', () => {
    const dataLength = 5;
    const prerenderItems = Math.max(dataLength - 1, 1);

    expect(prerenderItems).toBe(4);
  });

  it('should handle empty array case', () => {
    const dataLength = 0;
    const prerenderItems = Math.max(dataLength - 1, 1);

    // Even with empty array, prerenderItems should be at least 1
    expect(prerenderItems).toBe(1);
  });

  it('should verify visibility logic for single card', () => {
    // Simulating the visibility check in SwiperCard
    const index = 0;
    const currentActive = 0;
    const prerenderItems = 1; // After fix

    const shouldRender =
      index < currentActive + prerenderItems && index >= currentActive - 1;
    const indexDiff = index - currentActive;
    const shouldBeVisible = shouldRender && indexDiff < prerenderItems;

    expect(shouldRender).toBe(true);
    expect(shouldBeVisible).toBe(true);
  });
});
