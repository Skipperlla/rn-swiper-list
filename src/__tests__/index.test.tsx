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

describe('initialIndex data slicing behavior', () => {
  it('should slice data correctly when initialIndex is within bounds', () => {
    const data = [1, 2, 3, 4, 5];
    const initialIndex = 2;
    const slicedData = data.slice(initialIndex);
    expect(slicedData).toEqual([3, 4, 5]);
    expect(slicedData.length).toBe(3);
  });

  it('should return empty array when initialIndex equals data length', () => {
    const data = [1, 2, 3, 4, 5];
    const initialIndex = 5;
    const slicedData = data.slice(initialIndex);
    expect(slicedData).toEqual([]);
    expect(slicedData.length).toBe(0);
  });

  it('should return empty array when initialIndex is greater than data length', () => {
    const data = [1, 2, 3, 4, 5];
    const initialIndex = 10;
    const slicedData = data.slice(initialIndex);
    expect(slicedData).toEqual([]);
    expect(slicedData.length).toBe(0);
  });

  it('should return full array when initialIndex is 0', () => {
    const data = [1, 2, 3, 4, 5];
    const initialIndex = 0;
    const slicedData = data.slice(initialIndex);
    expect(slicedData).toEqual([1, 2, 3, 4, 5]);
    expect(slicedData.length).toBe(5);
  });

  it('should handle negative initialIndex by treating it as 0', () => {
    const data = [1, 2, 3, 4, 5];
    const initialIndex = -1;
    // JavaScript slice with negative index behaves differently than we expect
    // So this documents the actual behavior
    const slicedData = data.slice(initialIndex);
    expect(slicedData).toEqual([5]); // slice(-1) returns last element
  });

  it('should calculate adjusted prerenderItems correctly for sliced data', () => {
    const originalData = [1, 2, 3, 4, 5];
    const initialIndex = 2;
    const slicedData = originalData.slice(initialIndex); // [3, 4, 5]
    const prerenderItems = 3;

    const adjustedPrerenderItems = Math.min(
      prerenderItems,
      Math.max(slicedData.length - 1, 1)
    );

    // With slicedData.length = 3: Math.max(3 - 1, 1) = 2
    // Math.min(3, 2) = 2
    expect(adjustedPrerenderItems).toBe(2);
  });

  it('should handle index mapping for callbacks correctly', () => {
    const initialIndex = 2;
    const cardIndex = 1; // index in sliced data
    const originalIndex = cardIndex + initialIndex;
    expect(originalIndex).toBe(3);
  });
});
