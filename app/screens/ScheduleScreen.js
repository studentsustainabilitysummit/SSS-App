import { StyleSheet, TouchableOpacity, Text, View, Switch } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderView, {BackButtonView, LogoView, ToggleSwitchView} from '../views/HeaderView';
import EventListView from '../views/EventListView';
import FireClient from '../FireClient';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EventScreen from './EventScreen';
import ConversationScreen from './ConversationScreen';
import IsInPersonContext, { IsInPersonProvider } from '../context/IsInPersonContext';

const Stack = createNativeStackNavigator();
const fireClient = FireClient.getInstance();

function InPersonOnlineToggle() {
  const {isInPerson, toggleInPerson} = useContext(IsInPersonContext);
  
  return (
    <View style={styles.inPersonOnlineToggleContainer}>
      <Text style={isInPerson ? styles.blackText : styles.blueText}>Online</Text>
      <View style={styles.switchContainer}> 
        <Switch 
          trackColor={{false: '#04a7e7', true: '#6cc743'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#04a7e7"
          onValueChange={toggleInPerson}
          value={isInPerson}
        />
      </View>
      <Text style={isInPerson ? styles.greenText : styles.blackText}>In Person</Text>
    </View>
)
}

function MainSchedule({navigation}) {
  const [inPersonEvents, setInPersonEvents] = useState(fireClient.allInPersonEvents);
  const [onlineEvents, setOnlineEvents] = useState(fireClient.allOnlineEvents);
  const {isInPerson, toggleInPerson} = useContext(IsInPersonContext);
  
  useEffect(() => {
    const inPersonEventsUnsubscriber = fireClient.registerInPersonEventsCallback(setInPersonEvents);
    const onlineEventsUnsubscriber = fireClient.registerOnlineEventsCallback(setOnlineEvents);
    const unsubscribe = () => {
      inPersonEventsUnsubscriber();
      onlineEventsUnsubscriber();
    }
    return unsubscribe;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView 
        title={isInPerson ? "In Person Events" : "Online Events"} 
        leftComponent={<BackButtonView onPress={() => {navigation.goBack();}}/>}
      />
      <InPersonOnlineToggle/>
      <EventListView eventList={isInPerson? inPersonEvents : onlineEvents} navigation={navigation}/>
    </SafeAreaView>
  );
}

function MySchedule({navigation}) {
  const [userEvents, setEvents] = useState(fireClient.getUserEventList());
  const {isInPerson, toggleInPerson} = useContext(IsInPersonContext);

  useEffect(() => {
    const userEventsUnsubscriber = fireClient.registerUserEventsCallback(setEvents);
    const navigationUnsubscriber = navigation.getParent().addListener("tabPress", (e) => {
      const history = navigation.getParent().getState().history;
      if(history.length === 1) {
        navigation.navigate("MySchedule");
      }
    });
    const unsubscribe = () => {
      userEventsUnsubscriber();
      navigationUnsubscriber();
    }
    return unsubscribe;
  });

  const eventsText = isInPerson ? "In Person Events" : "Online Events";
  const buttonText = "All " + eventsText;
  const events = isInPerson ? userEvents.getInPerson() : userEvents.getOnline();
  const content = events.array.length > 0 ? (
    <EventListView eventList={events} navigation={navigation}/>
  ) : (
    <View style={styles.noEventsView}>
      <Text style={styles.noEventsText}>{"Use the button below to add some " + eventsText.toLowerCase() + " to your schedule!"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView 
        title={"My Schedule"} 
        leftComponent={<LogoView/>}
      />
      <InPersonOnlineToggle/>
      {content}
      <TouchableOpacity
        style={isInPerson ? styles.greenButton : styles.blueButton}
        onPress={() => {navigation.navigate("MainSchedule");}}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

}

export default function ScheduleScreen() {
  const [isInPerson, setIsInPerson] = useState(true);
  const toggleInPerson = () => {
    setIsInPerson(!isInPerson);
  }

  return (
    <IsInPersonProvider value={{isInPerson, toggleInPerson}}>
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
          <Stack.Screen 
            name="Conversation"
            component={ConversationScreen}
            options={{headerShown: false}}
          />
      </Stack.Navigator>
    </IsInPersonProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      greenButton: {
        width: "80%",
        borderRadius: 10,
        height: 60,
        marginTop: 20,
        marginBottom: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#6cc743'
      },
      blueButton: {
        width: "80%",
        borderRadius: 10,
        height: 60,
        marginTop: 20,
        marginBottom: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#04a7e7'
      },
      buttonText: {
        color: "white",
        fontFamily: "LeagueSpartan",
        fontSize: 22
      },
      noEventsView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
      },
      noEventsText: {
        fontFamily: "LeagueSpartan",
        fontSize: 18,
        textAlign: 'center'
      },
      switchContainer: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inPersonOnlineToggleContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      blackText: {
        color: 'black',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
      },
      blueText: {
        color: '#04a7e7',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
      },
      greenText: {
        color: '#6cc743',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
      }
})