import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Linking} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InPersonEvent, OnlineEvent } from '../Event';
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

  let enrollButton = userEvents.contains(event) ? (
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

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(event.zoom);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(event.zoom);
    } else {
      Alert.alert(`Don't know how to open this URL: ${event.zoom}`);
    }
  }, [event.zoom]);

  let zoomButton = event instanceof OnlineEvent ? (
    <TouchableOpacity
    style={styles.zoomButton}
    onPress={handlePress}
    >
      <Text style={styles.buttonText}>Zoom</Text>
    </TouchableOpacity>
  ) : (null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView 
        leftComponent={<BackButtonView onPress={() => {navigation.goBack();}}/>}
        rightComponent={<MessageBubble 
          clickable={userEvents.contains(event)} 
          onClick={() => {navigation.navigate("Conversation", {event})}}
          color={event.theme.color}
          />}
      />
      <Text style={styles.titleText}>{event.topic}</Text>
      <ScrollView style={{flex: 1}}>
        <View style={styles.headshotContainer}>
          <Image source={event.headshot} style={styles.headshot}/>
          <Text style={styles.subTitleText}>{event.speaker}</Text>
        </View>
        <Text style={styles.subTitleText}>Abstract</Text>
        <Text style={styles.text}>{'\t' + event.abstract}</Text>
        <Text style={styles.subTitleText}>Speaker Bio</Text>
        <Text style={styles.text}>{'\t' + event.bio}</Text>
      </ScrollView>
      {zoomButton}
      {enrollButton}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 3
  },
  enrollButton: {
    backgroundColor: '#6cc743',
    width: "80%",
    borderRadius: 10,
    height: 60,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  unEnrollButton: {
    backgroundColor: "#fa6464",
    width: "80%",
    borderRadius: 10,
    height: 60,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
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
  headshot: {
    height: 100,
    width: 100
  },
  headshotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20
  },
  titleText: {
    fontFamily: "LeagueSpartan",
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center'
  },
  subTitleText: {
    fontFamily: "LeagueSpartan",
    fontSize: 18,
    marginBottom: 5
  },
  text: {
    fontFamily: "LeagueSpartan",
    fontSize: 16,
  },
  zoomButton: {
    backgroundColor: "#04a7e7",
    width: "80%",
    borderRadius: 10,
    height: 60,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  }
})