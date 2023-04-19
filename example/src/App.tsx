import * as React from 'react';

import { SafeAreaView, StyleSheet } from 'react-native';
import { TinderCard } from 'rn-tinder-card';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TinderCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
