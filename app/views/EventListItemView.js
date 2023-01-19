import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function EventListItemView({event}) {

    let {name, topic, startTime, endTime} = event;

    return (
        <View style={styles.container}>
            <View style={{...styles.bubble, backgroundColor: topic.color}}>
                <Text style={styles.text}>{name}</Text>
                <Text style={styles.text}>{startTime.toString()}</Text>
                <Text style={styles.text}>{endTime.toString()}</Text>
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
    },
});