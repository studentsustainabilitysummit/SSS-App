import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import MessageListView from '../views/MessageListView'
import MessageSendView from '../views/MessageSendView'
import { SafeAreaView } from 'react-native-safe-area-context'
import FireClient from '../FireClient'
import HeaderView, { BackButtonView } from '../views/HeaderView'

export default function ConversationScreen({route, navigation}) {

  const {event} = route.params;

  const fireclient = FireClient.getInstance();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
      return fireclient.registerMessagesCallback(event, setMessages, messages);
  });

  return (
    <SafeAreaView style={styles.container}>
        <HeaderView leftComponent={<BackButtonView onPress={() => {navigation.goBack();}}/>}/>
        <MessageListView event={event} style={styles.list} messages={messages}/>
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