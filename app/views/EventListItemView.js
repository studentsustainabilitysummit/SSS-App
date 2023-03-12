import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function EventListItemView({event, navigation}) {

    let {topic, theme, speaker} = event;


    return (
        <View style={styles.container}>
            <TouchableOpacity 
            style={{...styles.bubble, backgroundColor: theme.color}}
            onPress={() =>
                navigation.navigate('Event', {event})
              }
            >
                <View style={styles.content}> 
                    <Text style={styles.text}>{topic}</Text>
                    <Text style={styles.text}>{speaker}</Text>
                    <Text style={styles.text}>{event.getTimeRangeString()}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        width: '90%',
        alignContent: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10
    },
    text: {
        paddingStart: 10,
        paddingEnd: 10,
        color: 'white',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
    },
    content: {
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
});