import * as React from 'react';

import { Alert, StyleSheet, Text, View } from 'react-native';

import { TinderCard } from 'rn-tinder-card';

export default function App() {
  return (
    <View style={styles.container}>
      <TinderCard
        cardWidth={180}
        cardHeight={244}
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
        <Text>Hey Sri</Text>
      </TinderCard>
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
