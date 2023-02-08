import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView from '../views/HeaderView';
import EventListView from '../views/EventListView';
import FireClient from '../FireClient';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import EventScreen from './EventScreen';
import HeaderBackButtonView from '../views/HeaderBackButtonView';

const Stack = createNativeStackNavigator();
const fireClient = FireClient.getInstance();

function MainSchedule({navigation}) {
  const [events, setEvents] = useState(fireClient.allInPersonEvents);
  fireClient.registerInPersonEventsCallback(setEvents);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBackButtonView title={"All Events"} navigation={navigation}/>
      <EventListView eventList={events} navigation={navigation}/>
    </SafeAreaView>
  )
}

function MySchedule({navigation}) {
  const [events, setEvents] = useState(fireClient.getUserEventList());
  fireClient.registerUserEventsCallback(setEvents);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView title={"My Schedule"}/>
      <EventListView eventList={events} navigation={navigation}/>
      <TouchableOpacity
      style={styles.allEventsButton}
      onPress={() => {navigation.navigate("MainSchedule");}}
      >
        <Text style={styles.buttonText}>All Events</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

}

export default function ScheduleScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
      <Stack.Screen 
          name="MySchedule"
          component={MySchedule}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="MainSchedule"
          component={MainSchedule}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Event"
          component={EventScreen}
          options={{headerShown: false}}
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
      allEventsButton: {
        backgroundColor: "#fa6464",
        width: "90%",
        borderRadius: 10,
        height: 60,
        marginTop: 30,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"
      },
      buttonText: {
        color: "white",
        fontFamily: "LeagueSpartan",
        fontSize: 22
      },
})