import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function EventListItemView({event}) {

    let {topic, theme, speaker} = event;


    return (
        <View style={styles.container}>
            <View style={{...styles.bubble, backgroundColor: theme.color}}>
                <Text style={styles.text}>{topic}</Text>
                <Text style={styles.text}>{speaker}</Text>
                <Text style={styles.text}>{event.getTimeRangeString()}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        width: '90%',
        height: '90%',
        alignContent: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
    },
    text: {
        paddingStart: 10,
        paddingEnd: 10,
        color: 'white',
        fontFamily: 'LeagueSpartan',
        fontSize: 16
    },
});