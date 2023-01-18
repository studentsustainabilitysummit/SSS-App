import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ScheduleScreen from './ScheduleScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <NavigationContainer>
        <Tab.Navigator screenOptions={tabBarOptions}>
            <Tab.Screen name="Schedule" component={ScheduleScreen}/>
            <Tab.Screen name="Map" component={MapScreen}/>
        </Tab.Navigator>
    </NavigationContainer>
  )
}

const tabBarOptions = {
    tabBarShowLabel: true,
    headerShown: false,
    tabBarStyle: {backgroundColor: '#fff'},
};