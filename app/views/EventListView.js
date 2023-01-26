import { StyleSheet, FlatList} from 'react-native'
import React from 'react'
import EventListItemView from './EventListItemView';

export default function EventListView({eventList, navigation}) {

    let {array} = eventList;

    return (
        <FlatList style={styles.list} data={array} renderItem={({item}) => <EventListItemView event={item} navigation={navigation}/>} />
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
    },
})