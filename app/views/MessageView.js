import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FireClient from '../FireClient'

export default function MessageView({message, event}) {
    const fireclient = FireClient.getInstance();
    const isUserMessage = message.sender === fireclient.user.email;
    const backgroundColor = isUserMessage ? event.theme.color : '#bec2bf';
    const marginLeft = isUserMessage ? '7.5%' : '2.5%';
    const email = isUserMessage ? (null) : (<Text style={styles.email}>{message.sender}</Text>);
  return (
    <View style={styles.container}>
        {email}
        <View 
        style={{...styles.bubble, backgroundColor, marginLeft}}
        >
            <View style={styles.content}>
                <Text style={styles.text}>{message.content}</Text>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    bubble: {
        width: '90%',
        alignContent: 'flex-start',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        borderRadius: 10,
    },
    content: {
        padding: 10
    },
    text: {
        paddingStart: 10,
        paddingEnd: 10,
        color: 'white',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
    },
    email: {
        paddingStart: '7%',
        color: 'black',
        fontFamily: 'LeagueSpartan',
        fontSize: 16,
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
})