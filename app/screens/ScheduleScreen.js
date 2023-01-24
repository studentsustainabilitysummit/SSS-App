import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView from '../views/HeaderView';
import EventListView from '../views/EventListView';
import FireClient from '../FireClient';


export default function ScheduleScreen() {

  const fireClient = FireClient.getInstance();

  const [events, setEvents] = useState(fireClient.allEvents);

  fireClient.registerAllEventsCallback(setEvents);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView title={"Schedule"}/>
      <EventListView eventList={events}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      
})