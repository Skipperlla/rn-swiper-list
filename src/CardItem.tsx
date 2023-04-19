import { View, Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Index</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',

    // flex: 1,
    backgroundColor: 'red',
  },
});

export default Index;
