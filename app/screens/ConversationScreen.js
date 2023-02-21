import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderBackButtonView from '../views/HeaderBackButtonView'
import MessageListView from '../views/MessageListView'
import MessageSendView from '../views/MessageSendView'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ConversationScreen({route, navigation}) {

  const {event} = route.params;

  return (
    <SafeAreaView style={styles.container}>
        <HeaderBackButtonView navigation={navigation}/>
        <MessageListView event={event} style={styles.list}/>
        <MessageSendView event={event}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  list: {
    marginBottom: 70
  }
})