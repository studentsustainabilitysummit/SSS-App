import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import HeaderBackButtonView from '../views/HeaderBackButtonView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InPersonEvent } from '../Event';
import FireClient from '../FireClient';

export default function EventScreen({route, navigation}) {

  const fireclient = FireClient.getInstance();

  let {event} = route.params;

  const [userEvents, setUserEvents] = useState(fireclient.getUserEventList());
  fireclient.registerUserEventsCallback(setUserEvents);

  let button = userEvents.contains(event) ? (
    <TouchableOpacity>
      <Text>Yes</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity>
      <Text>No</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBackButtonView navigation={navigation} title={"Event"}/>
      <View style={styles.body}>
        <Text>Topic: {event.topic}</Text>
        <Text>Speaker: {event.speaker}</Text>
        <Text>Theme: {event.theme.name}</Text>
        <Text>Time: {event.getTimeRangeString()}</Text>
        <Text>{event instanceof InPersonEvent? "Room: " + event.location.room : ""}</Text>
        {button}
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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: "flex-start"
  },
})