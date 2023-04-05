import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ScheduleScreen from './ScheduleScreen';
import MapScreen from './MapScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
          <Tab.Navigator screenOptions={tabBarOptions}>
              <Tab.Screen 
              name="Schedule" 
              component={ScheduleScreen} 
              options={{tabBarIcon: ({color}) => 
                (<MaterialCommunityIcons name="calendar" color={color} size={20}/>)}}
              />
              <Tab.Screen 
              name="Map" 
              component={MapScreen}
              options={{tabBarIcon: ({color}) => 
                (<MaterialCommunityIcons name="map" color={color} size={20}/>)}}
              />
          </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const tabBarOptions = {
    tabBarShowLabel: true,
    headerShown: false,
    tabBarStyle: {backgroundColor: '#fff'},
    tabBarHideOnKeyboard: Platform.OS === 'ios' ? false : true,
    tabBarActiveTintColor: '#04a7e7'
};