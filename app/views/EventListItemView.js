import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function EventListItemView({event}) {

    let {name, startTime, endTime} = event;

    return (
        <View style={styles.eventListItem}>
        <Text>{name}</Text>
        <Text>{startTime.toString()}</Text>
        <Text>{endTime.toString()}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    eventListItem: {
        width: '100%',
        height: 200,
        backgroundColor: "blue",
        alignContent: 'flex-start',
    },
});