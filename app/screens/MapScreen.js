import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'

export default function MapScreen() {
  return (
    <View style={styles.container}>
       <MapView
        style={styles.map}
        initialRegion={{
          latitude: 38.9882,
          longitude: -76.9445,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider='google'
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      }
})