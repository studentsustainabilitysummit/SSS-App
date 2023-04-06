import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import FireClient from '../FireClient'

export default function MapScreen({navigation}) {

  const fireClient = FireClient.getInstance();
  const mapRef = useRef();
  const timeoutRef = useRef();

  const mapIDs = fireClient.locationsList.map(location => location.id);

  const zoomToMarkers = () => {
    mapRef.current.fitToSuppliedMarkers(mapIDs, {
      animated: true,
      edgePadding: {
        top: Platform.OS === 'android' ? 200: 100,
        right: Platform.OS === 'android' ? 200: 100,
        bottom: Platform.OS === 'android' ? 200: 100,
        left: Platform.OS === 'android' ? 200: 100
      }
    });
  }

  const requestAndroidLocationPerms = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'SSS-App Location Permission',
        message: 'SSS-App needs your location to display it on the map',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    catch (error) {
      return false;
    }
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
      if (Platform.OS === 'android') {
        requestAndroidLocationPerms();
      }
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