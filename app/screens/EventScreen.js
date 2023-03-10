import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InPersonEvent } from '../Event';
import FireClient from '../FireClient';
import HeaderView, {BackButtonView} from '../views/HeaderView';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../fontello.json'

function MessageBubble({clickable, onClick, color}) {
  
  const Icon = createIconSetFromFontello(fontelloConfig);
  
  return (
    <TouchableOpacity onPress={() => {
      if(clickable) {
        onClick();
      }
      else {
        alert("Add the event to your schedule to access messages.")
      }
    }}>
      <View style={styles.messageBubble}>
        <Icon name="bubble" size={50} color={clickable? color : '#c4bdbc'}/>
      </View>
    </TouchableOpacity>
  )
}

export default function EventScreen({route, navigation}) {

  const fireclient = FireClient.getInstance();

  let {event} = route.params;

  const [userEvents, setUserEvents] = useState(fireclient.getUserEventList());

  useEffect(() => {
    let userEventsUnsubscriber = fireclient.registerUserEventsCallback(setUserEvents);
    const unsubscribe = () => {
      userEventsUnsubscriber();
    }
    return unsubscribe;
  });

  let button = userEvents.contains(event) ? (
    <TouchableOpacity 
    style={styles.unEnrollButton}
    onPress={() => {fireclient.unEnrollEvent(event)}}
    >
      <Text style={styles.buttonText}>Remove from my schedule</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity 
    style={styles.enrollButton}
    onPress={() => {fireclient.enrollEvent(event)}}
    >
      <Text style={styles.buttonText}>Add to my schedule</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView 
        title={event.topic} 
        leftComponent={<BackButtonView onPress={() => {navigation.goBack();}}/>}
        rightComponent={<MessageBubble 
          clickable={userEvents.contains(event)} 
          onClick={() => {navigation.navigate("Conversation", {event})}}
          color={event.theme.color}
          />}
      />
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
    textAlign: "flex-start",
    width: "100%"
  },
  enrollButton: {
    backgroundColor: '#6cc743',
    width: "80%",
    borderRadius: 10,
    height: 60,
    marginTop: 50,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 20
  },
  unEnrollButton: {
    backgroundColor: "#fa6464",
    width: "80%",
    borderRadius: 10,
    height: 60,
    marginTop: 40,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 20
  },
  buttonText: {
    color: "white",
    fontFamily: "LeagueSpartan",
    fontSize: 22
  },
  messageBubble: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
})