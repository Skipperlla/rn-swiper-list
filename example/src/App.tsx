import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import TinderCard from 'rn-tinder-card';

export default function App() {
  return (
    <View style={styles.container}>
      <TinderCard />
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
