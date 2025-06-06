# rn-swiper-list ⚡️

https://github.com/Skipperlla/rn-tinder-swiper/assets/68515357/149b7418-cc2f-489b-9133-e6ba7120b277

⚡ Lightning fast and customizable tinder-like swiper for React Native

## Installation ⚙️

```sh
yarn add rn-swiper-list
```

`rn-swiper-list` needs `react-native-reanimated` and `react-native-gesture-handler` package 💎

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
- [x] Swipe back to previous card with a custom animation
- [x] More swipe events callbacks
- [x] Integrating and using a single card with flatlist

# Props ✏️

## Card Props

| Props        | type                     | description                                                                            | required | default        |
| :----------- | :----------------------- | :------------------------------------------------------------------------------------- | :------- | :------------- |
| data         | array                    | Array of data objects used to render the cards.                                        | Yes      |                |
| renderCard   | func(cardData,cardIndex) | Function that renders a card based on the provided data and index.                     | Yes      |                |
| prerenderItems | number                 | Number of cards to prerender ahead of the active card for better performance.           | No       | data.length - 1|
| cardStyle    | object                   | CSS style properties applied to each card. These can be applied inline.                |          |                |
| keyExtractor | func                     | Function that returns a unique key for each card based on the provided data.           | No       |                |
| children     | React.ReactNode          | Child components to be displayed inside the component. Used typically for composition. |          |                |
| loop         | bool                     | If true, the swiper will loop back to the first card after the last card is swiped.    | No       | false          |

## Event callbacks

| Props         | type | description                                                                                           | default             |
| :------------ | :--- | :---------------------------------------------------------------------------------------------------- | :------------------ |
| onSwipeLeft   | func | Function called when a card is swiped left. It receives the index of the card as a parameter.         | `(cardIndex) => {}` |
| onSwipeRight  | func | Function called when a card is swiped right. It receives the index of the card as a parameter.        | `(cardIndex) => {}` |
| onSwipeTop    | func | Function called when a card is swiped top. It receives the index of the card as a parameter.          | `(cardIndex) => {}` |
| onSwipeBottom | func | Function called when a card is swiped bottom. It receives the index of the card as a parameter.       | `(cardIndex) => {}` |
| onSwipedAll   | func | Function called when all cards have been swiped.                                                      | `() => {}`          |
| onSwipeStart  | func | Function called when a swipe event starts.                                                            | `() => {}`          |
| onSwipeEnd    | func | Function called when a swipe event ends.                                                              | `() => {}`          |
| onSwipeActive | func | Function called when a swipe event is active.                                                         | `() => {}`          |
| onIndexChange | func | Function called when the index of the card changes. It receives the index of the card as a parameter. | `(cardIndex) => {}` |
| onPress       | func | Function called when the card is pressed (tapped).                                                    | `() => {}`          |

## Swipe Animation Props

| props             | type | description                                     | default |
| :---------------- | :--- | :---------------------------------------------- | :------ |
| disableLeftSwipe  | bool | If true, disables the ability to swipe left.    | `false` |
| disableRightSwipe | bool | If true, disables the ability to swipe right.   | `false` |
| disableTopSwipe   | bool | If true, disables the ability to swipe upwards. | `false` |

## Rotation Animation Props

| props               | type  | description                                                   | default                                    |
| :------------------ | :---- | :------------------------------------------------------------ | :----------------------------------------- |
| translateXRange     | array | Translates the card horizontally.                             | `[-windowWidth / 3, 0, windowWidth / 3]`   |
| translateYRange     | array | Translates the card vertically.                               | `[-windowHeight / 3, 0, windowHeight / 3]` |
| rotateInputRange    | array | Array specifying the range of x values for rotation mapping.  | `[-windowWidth / 3, 0, windowWidth / 3]`   |
| outputRotationRange | array | Array of rotation values corresponding to `rotateInputRange`. | `[-Math.PI / 20, 0, Math.PI / 20]`         |

## Overlay Labels Animation Props

| props                               | type              | description                                                                                             | default                    |
| :---------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------ | :------------------------- |
| inputOverlayLabelRightOpacityRange  | array             | Array defining the input range for animating the opacity of the right overlay label.                    | `[0, windowWidth / 3]`     |
| outputOverlayLabelRightOpacityRange | array             | Array defining the output opacity values for the right overlay label, corresponding to the input range. | `[0, 1]`                   |
| inputOverlayLabelLeftOpacityRange   | array             | Array defining the input range for animating the opacity of the left overlay label.                     | `[0, -(windowWidth / 3)]`  |
| outputOverlayLabelLeftOpacityRange  | array             | Array defining the output opacity values for the left overlay label, corresponding to the input range.  | `[0, 1]`                   |
| inputOverlayLabelTopOpacityRange    | array             | Array defining the input range for animating the opacity of the top overlay label.                      | `[0, -(windowHeight / 3)]` |
| outputOverlayLabelTopOpacityRange   | array             | Array defining the output opacity values for the top overlay label, corresponding to the input range.   | `[0, 1]`                   |
| OverlayLabelRight                   | () => JSX.Element | Component rendered as an overlay label for right swipes.                                                |                            |
| OverlayLabelLeft                    | () => JSX.Element | Component rendered as an overlay label for left swipes.                                                 |                            |
| OverlayLabelTop                     | () => JSX.Element | Component rendered as an overlay label for top swipes.                                                  |                            |

## Swipe methods

| props      | type     | description                                                    |
| :--------- | :------- | :------------------------------------------------------------- |
| swipeBack  | callback | Resets the card position after a swipe event                   |
| swipeRight | callback | Animates the card to fling to the right and calls onSwipeRight |
| swipeLeft  | callback | Animates the card to fling to the left and calls onSwipeLeft   |
| swipeTop   | callback | Animates the card to fling to the top and calls onSwipeTop     |

## Swipe Animation Spring Configs (Animation Speed)

| props                  | type         | description                                                  |
| :--------------------- | :----------- | :----------------------------------------------------------- |
| swipeBackXSpringConfig | SpringConfig | Spring configuration for swipe back animation on the X-axis. |
| swipeBackYSpringConfig | SpringConfig | Spring configuration for swipe back animation on the Y-axis. |
| swipeRightSpringConfig | SpringConfig | Spring configuration for swipe right animation on the X-axis. |
| swipeLeftSpringConfig  | SpringConfig | Spring configuration for swipe left animation on the X-axis.  |
| swipeTopSpringConfig   | SpringConfig | Spring configuration for swipe top animation on the Y-axis. |
| swipeBottomSpringConfig | SpringConfig | Spring configuration for swipe bottom animation on the Y-axis. |

### What is Spring Config?

Spring configuration is used to control the animation behavior of the swipe actions. The spring configuration consists of several parameters that define the physical properties of the spring animation. Here are the details of each parameter:

| Parameter                 | Type   | Description                                                                                                                                                |
| :------------------------ | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| damping                   | number | Controls the amount of damping in the spring. Higher values result in more damping, causing the animation to slow down more quickly.                       |
| stiffness                 | number | Controls the stiffness of the spring. Higher values result in a stiffer spring, causing the animation to be more rigid and faster.                         |
| mass                      | number | Controls the mass of the object being animated. Higher values result in a heavier object, causing the animation to be slower.                              |
| overshootClamping         | bool   | If true, the spring animation will not overshoot its target value. This means the animation will stop exactly at the target value without bouncing.        |
| restDisplacementThreshold | number | The threshold for the displacement of the spring below which the spring is considered to be at rest. Lower values result in a more precise stopping point. |
| restSpeedThreshold        | number | The threshold for the speed of the spring below which the spring is considered to be at rest. Lower values result in a more precise stopping point.        |

These parameters can be adjusted to achieve the desired animation behavior for the swipe actions. The default values provided in the `SWIPE_SPRING_CONFIG` are:

## Usage 🧑‍💻

```typescript
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';

import { ActionButton } from '../components';

const IMAGES: ImageSourcePropType[] = [
  require('../assets/images/1.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/3.jpg'),
  require('../assets/images/4.jpg'),
  require('../assets/images/5.jpg'),
  require('../assets/images/6.jpg'),
];

const App = () => {
  const ref = useRef<SwiperCardRefType>();

  const renderCard = useCallback(
    (image: ImageSourcePropType) => {
      return (
        <View style={styles.renderCardContainer}>
          <Image
            source={image}
            style={styles.renderCardImage}
            resizeMode="cover"
          />
        </View>
      );
    },
    []
  );
  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'green',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelTop = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'blue',
          },
        ]}
      />
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.subContainer}>
        <Swiper
          ref={ref}
          cardStyle={styles.cardStyle}
          data={IMAGES}
          renderCard={renderCard}
          onIndexChange={(index) => {
            console.log('Current Active index', index);
          }}
          onSwipeRight={(cardIndex) => {
            console.log('cardIndex', cardIndex);
          }}
          onPress={() => {
            console.log('onPress');
          }}
          onSwipedAll={() => {
            console.log('onSwipedAll');
          }}
          onSwipeLeft={(cardIndex) => {
            console.log('onSwipeLeft', cardIndex);
          }}
          onSwipeTop={(cardIndex) => {
            console.log('onSwipeTop', cardIndex);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelTop={OverlayLabelTop}
          onSwipeActive={() => {
            console.log('onSwipeActive');
          }}
          onSwipeStart={() => {
            console.log('onSwipeStart');
          }}
          onSwipeEnd={() => {
            console.log('onSwipeEnd');
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeLeft();
          }}
        >
          <AntDesign name="close" size={32} color="white" />
        </ActionButton>
        <ActionButton
          style={[styles.button, { height: 60, marginHorizontal: 10 }]}
          onTap={() => {
            ref.current?.swipeBack();
          }}
        >
          <AntDesign name="reload1" size={24} color="white" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeTop();
          }}
        >
          <AntDesign name="arrowup" size={32} color="white" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeRight();
          }}
        >
          <AntDesign name="heart" size={32} color="white" />
        </ActionButton>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    bottom: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width: '95%',
    height: '75%',
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    height: '75%',
    width: '100%',
  },
  renderCardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});


```

For more examples check out the [example](https://github.com/Skipperlla/rn-swiper-list/blob/main/example/src/App.tsx) folder 📂

## Types 🏷️

```ts
type SwiperCardRefType =
  | {
      swipeRight: () => void;
      swipeLeft: () => void;
      swipeBack: () => void;
      swipeTop: () => void;
    }
  | undefined;

type SwiperOptions<T> = {
  /*
   * Card data and render function
   */
  data: T[];
  renderCard: (item: T, index: number) => JSX.Element;
  prerenderItems?: number;
  cardStyle?: StyleProp<ViewStyle>;
  /*
   * Children components
   */
  onSwipeLeft?: (cardIndex: number) => void;
  onSwipeRight?: (cardIndex: number) => void;
  onSwipeTop?: (cardIndex: number) => void;
  onSwipedAll?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onSwipeActive?: () => void;
  /*
   * Swipe methods
   */
  disableRightSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableTopSwipe?: boolean;
  /*
   * Rotation Animation Props
   */
  translateXRange?: number[];
  translateYRange?: number[];
  rotateInputRange?: number[];
  rotateOutputRange?: number[];
  /*
   * Overlay Labels Animation Props
   */
  inputOverlayLabelRightOpacityRange?: number[];
  outputOverlayLabelRightOpacityRange?: number[];
  inputOverlayLabelLeftOpacityRange?: number[];
  outputOverlayLabelLeftOpacityRange?: number[];
  inputOverlayLabelTopOpacityRange?: number[];
  outputOverlayLabelTopOpacityRange?: number[];
  OverlayLabelRight?: () => JSX.Element;
  OverlayLabelLeft?: () => JSX.Element;
  OverlayLabelTop?: () => JSX.Element;
  /*
   * Swipe Animation Spring Configs (Animation Speed)
   */
  swipeBackXSpringConfig?: SpringConfig;
  swipeBackYSpringConfig?: SpringConfig;
  swipeRightSpringConfig?: SpringConfig;
  swipeLeftSpringConfig?: SpringConfig;
  swipeTopSpringConfig?: SpringConfig;
  swipeBottomSpringConfig?: SpringConfig;
};
```

## Contributing 🔖

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License 📰

[MIT](LICENSE)
