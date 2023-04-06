import { StyleSheet, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import FireClient from '../FireClient'

export default function MapScreen({navigation}) {

  const fireClient = FireClient.getInstance();
  const mapRef = useRef();
  const timeoutRef = useRef();

  const mapIDs = fireClient.locationsList.map(location => location.id);

  const zoomToMarkers = () => {
    mapRef.current.fitToSuppliedMarkers(mapIDs, {animated: true, edgePadding: {top: 200, right: 200, bottom: 200, left: 200}});
  }

  useEffect(() => {
    const navigationUnsubscriber = navigation.addListener("tabPress", (e) => {
      const history = navigation.getState().history;
      if(history.length === 2) {
        zoomToMarkers();
      }
    });

    timeoutRef.current = setTimeout(() => {
      zoomToMarkers();
    }, 100);

    const unsubscribe = () => {
      navigationUnsubscriber();
      clearTimeout(timeoutRef.current);
    }

    return unsubscribe;
  });

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
          ref={mapRef} 
          showsUserLocation={true}
      >
        {fireClient.locationsList.map((location, index) => (
            <Marker
              identifier={location.id}
              key={index}
              coordinate={{latitude: location.lat, longitude: location.lon}}
              title={location.room}
              description={location.room}
            />
          ))}
      </MapView>
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