import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { TinderCard } from 'rn-tinder-card';

// const { width, height } = Dimensions.get('screen');

export default function App() {
  return (
    <View style={styles.container}>
      <TinderCard
        cardWidth={380}
        cardHeight={636}
        // disableRightSwipe
        // disableTopSwipe
        // disableLeftSwipe
        // translateXRange={[-width / 2, 0, width / 2]}
        // translateYRange={[height / 2, 0, -height / 2]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
