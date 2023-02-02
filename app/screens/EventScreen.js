import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import HeaderBackButtonView from '../views/HeaderBackButtonView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InPersonEvent } from '../Event';

export default function EventScreen({route, navigation}) {

  let {event} = route.params;

  

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBackButtonView navigation={navigation} title={"Event"}/>
      <View style={styles.body}>
        <Text>Topic: {event.topic}</Text>
        <Text>Speaker: {event.speaker}</Text>
        <Text>Theme: {event.theme.name}</Text>
        <Text>Time: {event.getTimeRangeString()}</Text>
        <Text>{event instanceof InPersonEvent? "Room: " + event.location.room : ""}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  body: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
})