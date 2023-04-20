import * as React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { TinderCard } from 'rn-tinder-card';

const data = [
  'https://images.unsplash.com/photo-1681896616404-6568bf13b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',
  'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  'https://images.unsplash.com/photo-1681238091934-10fbb34b497a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1282&q=80',
];

export default function App() {
  // const OverlayRight = () => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: 'green',
  //         // width: 100k,
  //         width: '100%',
  //         height: '100%',
  //         borderRadius: 48,
  //         justifyContent: 'center',
  //         alignItems: 'center',

  //         // zIndex: 12,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           color: 'white',
  //           fontSize: 32,
  //           fontWeight: 'bold',
  //         }}
  //       >
  //         Like
  //       </Text>
  //     </View>
  //   );
  // };
  // const OverlayLeft = () => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: 'red',
  //         // width: 100k,
  //         width: '100%',
  //         height: '100%',
  //         borderRadius: 48,
  //         justifyContent: 'center',
  //         alignItems: 'center',

  //         // zIndex: 12,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           color: 'white',
  //           fontSize: 32,
  //           fontWeight: 'bold',
  //         }}
  //       >
  //         Disslike
  //       </Text>
  //     </View>
  //   );
  // };

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
              // OverlayRight={OverlayRight}
              // OverlayLeft={OverlayLeft}
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
