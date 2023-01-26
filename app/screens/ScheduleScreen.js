import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView from '../views/HeaderView';
import EventListView from '../views/EventListView';
import FireClient from '../FireClient';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import EventScreen from './EventScreen';

const Stack = createNativeStackNavigator();
const fireClient = FireClient.getInstance();

function MainSchedule({navigation}) {
  const [events, setEvents] = useState(fireClient.allEvents);

  fireClient.registerAllEventsCallback(setEvents);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView title={"Schedule"}/>
      <EventListView eventList={events} navigation={navigation}/>
    </SafeAreaView>
  )
}

export default function ScheduleScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainSchedule"
          component={MainSchedule}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Event"
          component={EventScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
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