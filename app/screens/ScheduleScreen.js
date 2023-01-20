import { FlatList, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import BuildingLocation from '../BuildingLocation';
import { InPersonEvent } from '../Event';
import EventListItemView from '../views/EventListItemView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../Theme';
import HeaderView from '../views/HeaderView';

const location1 = new BuildingLocation(1, "First building", "101", 38.98598, -76.94509);
const location2 = new BuildingLocation(2, "First building", "201", 38.98598, -76.94509);

const event1 = new InPersonEvent(1, Theme.Development, "First event", new Date(2023, 1, 18, 12, 0), new Date(2023, 1, 18, 14, 0), location1);
const event2 = new InPersonEvent(2, Theme.Energy, "Second event", new Date(2023, 1, 18, 12, 30), new Date(2023, 1, 18, 14, 30), location2);
const event3 = new InPersonEvent(3, Theme.Health, "Third event", new Date(2023, 1, 18, 15, 0), new Date(2023, 1, 18, 17, 0), location2);
const event4 = new InPersonEvent(4, Theme.Climate, "First event", new Date(2023, 1, 18, 12, 0), new Date(2023, 1, 18, 14, 0), location1);
const event5 = new InPersonEvent(5, Theme.Life, "Second event", new Date(2023, 1, 18, 12, 30), new Date(2023, 1, 18, 14, 30), location2);
const event6 = new InPersonEvent(6, Theme.get(3), "Third event", new Date(2023, 1, 18, 15, 0), new Date(2023, 1, 18, 17, 0), location2);

const events = [event1, event2, event3, event4, event5, event6];


export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderView title={"Schedule"}/>
      <FlatList style={styles.list} data={events} renderItem={({item}) => <EventListItemView event={item} />} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      list: {
        width: '100%',
      }
})