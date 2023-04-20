# rn-tinder-card ⚡️

⚡ Lightning fast and customizable tinder-like swipe card for React Native

## Installation ⚙️

```sh
yarn add rn-tinder-card
```

`rn-tinder-card` needs `react-native-reanimated` and `react-native-gesture-handler` package 💎

```sh
yarn add react-native-reanimated react-native-gesture-handler
```

👇 You also need to complete installations of these packages for more information use the links below 👇

- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

## Overview

- [x] Rotation animation
- [x] Swipe event callbacks
- [x] Scale animation
- [ ] Overlay labels
- [ ] Swipe back to previous card with a custom animation
- [ ] More swipe events callbacks

# Props ✏️

## Event callbacks

| Props         | type | description                                       | default  |
| :------------ | :--- | :------------------------------------------------ | :------- |
| onSwipedLeft  | func | function to be called when a card is swiped left  | () => {} |
| onSwipedRight | func | function to be called when a card is swiped right | () => {} |
| onSwipedTop   | func | function to be called when a card is swiped top   | () => {} |

## Swipe animation props

| props             | type | description         | default |
| :---------------- | :--- | :------------------ | :------ |
| disableLeftSwipe  | bool | disable left swipe  | false   |
| disableRightSwipe | bool | disable right swipe | false   |
| disableTopSwipe   | bool | disable top swipe   | false   |

## Rotation animation props

| props               | type  | description                                            | default            |
| :------------------ | :---- | :----------------------------------------------------- | :----------------- |
| inputRotationRange  | array | x values range for the rotation output                 | [-width, 0, width] |
| outputRotationRange | array | rotation values for the x values in inputRotationRange | [-10, 0, 10]       |

## Usage 🧑‍💻

```typescript
import * as React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { TinderCard } from 'rn-tinder-card';

const data = [
  'https://images.unsplash.com/photo-1681896616404-6568bf13b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',
  'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  'https://images.unsplash.com/photo-1681238091934-10fbb34b497a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1282&q=80',
];

export default function App() {
  return (
    <View style={styles.wrapper}>
      {data.map((item, index) => {
        return (
          <View
            style={styles.cardContainer}
            pointerEvents="box-none"
            key={index}
          >
            <TinderCard
              cardWidth={380}
              cardHeight={730}
              cardStyle={styles.card}
              onSwipedRight={() => {
                Alert.alert('Swiped right');
              }}
              onSwipedTop={() => {
                Alert.alert('Swiped Top');
              }}
              onSwipedLeft={() => {
                Alert.alert('Swiped left');
              }}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TinderCard>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 48,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
});
```

For more examples check out the [example](https://github.com/Skipperlla/rn-tinder-card/blob/main/example/src/App.tsx) folder 📂

## Types 🏷️

```ts
export type TinderCardOptions = PropsWithChildren<{
  /**
   * The card of the width.
   */
  cardWidth: number;
  /**
   * The card of the height.
   */
  cardHeight: number;
  /**
   * The card of the x coordinate.
   */
  translateXRange: number[];
  /**
   * The card of the y coordinate.
   */
  translateYRange: number[];

  /**
   * The card of the input and output rotation range.
   */
  inputRotationRange: number[];
  outputRotationRange: number[];

  /**
   * Disable Right,Left and Top Swipe
   */
  disableRightSwipe: boolean;
  disableLeftSwipe: boolean;
  disableTopSwipe: boolean;

  /**
   * The card of the style.
   */
  cardStyle: StyleProp<ViewStyle>;

  /**
   * The card of the callbacks.
   */
  onSwipedRight: () => void;
  onSwipedLeft: () => void;
  onSwipedTop: () => void;

  /**
   * The card of the animation scale value.
   */
  scaleValue: number;
}>;
```

## Contributing 🔖

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License 📰

[MIT](LICENSE)
