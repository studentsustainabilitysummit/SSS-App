import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import FireClient from '../FireClient';

export default function MessageSendView({event}) {

  const [content, setContent] = useState("");
  const fireclient = FireClient.getInstance();
  const clearContent = useCallback(() => {
    setContent("");
  });

  return (
    <View style={{...styles.container, backgroundColor: event.theme.color}}>
      <View style={styles.inputView}>
        <TextInput
                      style={styles.textInput}
                      value={content}
                      placeholder="Send Message"
                      textAlign="center"
                      onChangeText={newContent => {setContent(newContent)}}
                  />
      </View>
      <TouchableOpacity 
      style={styles.sendButton}
      onPress={() => {
        try{
          fireclient.sendMessage(event, content);
          clearContent();
        } catch {
          alert("There was an error sending your message");
        }
      }}
      > 
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6cc743',
      width: '95%',
      height: 50,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
      left: '2.5%'
    },
    text: {
      
    },
    textInput: {
      flex: 1,
      height: "auto",
      fontFamily: "LeagueSpartan",
      fontSize: 18,
      color: "white",
    },
    inputView: {
      width: "70%",
      alignItems: "center",
      height: 30,
      backgroundColor: '#bec2bf',
      borderRadius: 10,
      marginLeft: '5%',
      marginRight: '5%'
    },
    sendButton: {
      width: '15%',
      textAlign: 'center',
      alignItems: 'center',
      backgroundColor: '#bec2bf',
      borderRadius: 10,
      marginLeft: '2.5%',
      marginRight: '2.5%'

    },
    sendText: {

    }
})