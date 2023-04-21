# rn-tinder-card ⚡️

https://user-images.githubusercontent.com/68515357/233647214-47fbf6fc-3c66-478d-8ce8-d4e3ea08ad9a.mp4

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
- [x] Overlay labels
- [ ] Swipe back to previous card with a custom animation
- [ ] More swipe events callbacks

# Props ✏️

## Card Props

| Props           | type            | description                                     | default                                  |
| :-------------- | :-------------- | :---------------------------------------------- | :--------------------------------------- |
| cardWidth       | number          | The width of the card                           | windowWidth                              |
| cardHeight      | number          | The height of the card                          | windowHeight                             |
| translateXRange | array           | The range for card translation along the X-axis | [-windowWidth / 2, 0, windowWidth / 2]   |
| translateYRange | array           | The range for card translation along the Y-axis | [-windowHeight / 2, 0, windowHeight / 2] |
| cardStyle       | object          | The style properties applied to the card        | {}                                       |
| scaleValue      | number          | The scale factor for card animation             | 1                                        |
| children        | React.ReactNode | The scale factor for card animation             | 1                                        |

## Event callbacks

| Props         | type | description                                       | default  |
| :------------ | :--- | :------------------------------------------------ | :------- |
| onSwipedLeft  | func | function to be called when a card is swiped left  | () => {} |
| onSwipedRight | func | function to be called when a card is swiped right | () => {} |
| onSwipedTop   | func | function to be called when a card is swiped top   | () => {} |

## Swipe Animation Props

| props             | type | description         | default |
| :---------------- | :--- | :------------------ | :------ |
| disableLeftSwipe  | bool | disable left swipe  | false   |
| disableRightSwipe | bool | disable right swipe | false   |
| disableTopSwipe   | bool | disable top swipe   | false   |

## Rotation Animation Props

| props               | type  | description                                            | default            |
| :------------------ | :---- | :----------------------------------------------------- | :----------------- |
| inputRotationRange  | array | x values range for the rotation output                 | [-width, 0, width] |
| outputRotationRange | array | rotation values for the x values in inputRotationRange | [-10, 0, 10]       |

## Overlay Labels Animation Props

| props                               | type              | description                                                | default                |
| :---------------------------------- | :---------------- | :--------------------------------------------------------- | :--------------------- |
| inputOverlayLabelRightOpacityRange  | array             | Input range for the right overlay label opacity animation  | [0, windowWidth / 2]   |
| outputOverlayLabelRightOpacityRange | array             | Output range for the right overlay label opacity animation | [0, 1]                 |
| inputOverlayLabelLeftOpacityRange   | array             | Input range for the left overlay label opacity animation   | [0, -windowWidth / 2]  |
| outputOverlayLabelLeftOpacityRange  | array             | Output range for the left overlay label opacity animation  | [0, 1]                 |
| inputOverlayLabelTopOpacityRange    | array             | Input range for the top overlay label opacity animation    | [0, -windowHeight / 2] |
| outputOverlayLabelTopOpacityRange   | array             | Output range for the top overlay label opacity animation   | [0, 1]                 |
| OverlayRight                        | () => JSX.Element | Component for the right swipe overlay label                |                        |
| OverlayLeft                         | () => JSX.Element | Component for the left swipe overlay label                 |                        |
| OverlayTop                          | () => JSX.Element | Component for the top swipe overlay label                  |                        |

## Usage 🧑‍💻

```typescript
import * as React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { TinderCard } from 'rn-tinder-card';

const data = [
  'https://images.unsplash.com/photo-1681896616404-6568bf13b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',
  'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  'https://images.unsplash.com/photo-1681238091934-10fbb34b497a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1282&q=80',
];

export default function App() {
  const OverlayRight = () => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'green',
          },
        ]}
      >
        <Text style={styles.overlayLabelText}>Like</Text>
      </View>
    );
  };
  const OverlayLeft = () => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      >
        <Text style={styles.overlayLabelText}>Nope</Text>
      </View>
    );
  };
  const OverlayTop = () => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'blue',
          },
        ]}
      >
        <Text style={styles.overlayLabelText}>Super Like</Text>
      </View>
    );
  };

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
              OverlayLabelRight={OverlayRight}
              OverlayLabelLeft={OverlayLeft}
              OverlayLabelTop={OverlayTop}
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
  overlayLabelContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLabelText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
});
```

For more examples check out the [example](https://github.com/Skipperlla/rn-tinder-card/blob/main/example/src/App.tsx) folder 📂

## Types 🏷️

```ts
export type TinderCardOptions = PropsWithChildren<{
  /*
  The width of the card.
  */
  cardWidth: number;

  /*
  The width of the card.
  */
  cardHeight: number;

  /* 
  The x coordinate range for card translation.
  */
  translateXRange: number[];

  /*
  The y coordinate range for card translation.
  */
  translateYRange: number[];

  /*
  The input and output ranges for card rotation.
  */
  inputRotationRange: number[];
  outputRotationRange: number[];

  /*
  The input and output ranges for swipe direction overlay label opacity.
  */

  inputOverlayLabelRightOpacityRange: number[];
  outputOverlayLabelRightOpacityRange: number[];
  inputOverlayLabelLeftOpacityRange: number[];
  outputOverlayLabelLeftOpacityRange: number[];

  inputOverlayLabelTopOpacityRange: number[];
  outputOverlayLabelTopOpacityRange: number[];

  /*
  Disable right, left, and top swipes.
  */
  disableRightSwipe: boolean;
  disableLeftSwipe: boolean;
  disableTopSwipe: boolean;

  /*
  The style of the card.
  */
  cardStyle: StyleProp<ViewStyle>;
  /*
  Callbacks for swipe events.
  */
  onSwipedRight: () => void;
  onSwipedLeft: () => void;
  onSwipedTop: () => void;

  /*
  The scale value for card animation.
  */
  scaleValue: number;

  /*  
  Swipe direction overlay label components.
  */
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
}>;
```

## Contributing 🔖

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License 📰

[MIT](LICENSE)
