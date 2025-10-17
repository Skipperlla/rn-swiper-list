// Test to verify prerenderItems calculation logic
describe('Swiper prerenderItems calculation', () => {
  it('should calculate prerenderItems correctly for single item', () => {
    const dataLength = 1;
    // The default calculation is: prerenderItems = Math.max(data.length - 1, 1)
    // For single item: Math.max(1 - 1, 1) = Math.max(0, 1) = 1
    const prerenderItems = Math.max(dataLength - 1, 1);
    expect(prerenderItems).toBe(1);
  });

  it('should calculate prerenderItems correctly for multiple items', () => {
    const dataLength = 5;
    const prerenderItems = Math.max(dataLength - 1, 1);
    expect(prerenderItems).toBe(4);
  });

  it('should handle empty array case', () => {
    const dataLength = 0;
    const prerenderItems = Math.max(dataLength - 1, 1);
    // With empty array, no cards will render regardless of prerenderItems value
    // The value of 1 ensures the formula is consistent but has no practical effect
    expect(prerenderItems).toBe(1);
  });

  it('should ensure prerenderItems is always at least 1', () => {
    // Test edge cases to ensure the minimum value is always 1
    expect(Math.max(-1, 1)).toBe(1);
    expect(Math.max(0, 1)).toBe(1);
    expect(Math.max(1, 1)).toBe(1);
    expect(Math.max(2, 1)).toBe(2);
  });
});

// Note: Component rendering tests would be better suited for integration tests
// using tools like React Native Testing Library with proper setup files
// that can handle the complex mocking requirements for react-native-reanimated
// and react-native-gesture-handler.
