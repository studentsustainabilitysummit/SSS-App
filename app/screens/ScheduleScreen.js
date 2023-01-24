import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView from '../views/HeaderView';
import EventListView from '../views/EventListView';
import FireClient from '../FireClient';


export default function ScheduleScreen() {

  let events = FireClient.getInstance().allEvents;

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