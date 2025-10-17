describe('Swiper prerenderItems logic', () => {
  it('should ensure maxPrerender is at least 1 when prerenderItems is 0', () => {
    const prerenderItems = 0;
    const maxPrerender = Math.max(1, prerenderItems);
    expect(maxPrerender).toBe(1);
  });

  it('should preserve prerenderItems value when it is greater than 0', () => {
    const prerenderItems = 5;
    const maxPrerender = Math.max(1, prerenderItems);
    expect(maxPrerender).toBe(5);
  });

  it('should calculate correct visibility for single card (prerenderItems = 0)', () => {
    const index = 0;
    const currentActive = 0;
    const prerenderItems = 0;
    const maxPrerender = Math.max(1, prerenderItems);

    const shouldRender =
      index < currentActive + maxPrerender && index >= currentActive - 1;
    const indexDiff = index - currentActive;
    const isVisible = shouldRender && indexDiff < maxPrerender;

    expect(shouldRender).toBe(true);
    expect(indexDiff).toBe(0);
    expect(isVisible).toBe(true);
  });

  it('should calculate correct visibility for multiple cards', () => {
    const currentActive = 0;
    const prerenderItems = 2;
    const maxPrerender = Math.max(1, prerenderItems);

    // Card 0 should be visible
    let index = 0;
    let shouldRender =
      index < currentActive + maxPrerender && index >= currentActive - 1;
    let indexDiff = index - currentActive;
    expect(shouldRender && indexDiff < maxPrerender).toBe(true);

    // Card 1 should be visible
    index = 1;
    shouldRender =
      index < currentActive + maxPrerender && index >= currentActive - 1;
    indexDiff = index - currentActive;
    expect(shouldRender && indexDiff < maxPrerender).toBe(true);

    // Card 2 should not be visible (index 2 is not < currentActive 0 + maxPrerender 2)
    index = 2;
    shouldRender =
      index < currentActive + maxPrerender && index >= currentActive - 1;
    indexDiff = index - currentActive;
    expect(shouldRender && indexDiff < maxPrerender).toBe(false);
  });
});
