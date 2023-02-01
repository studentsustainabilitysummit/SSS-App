import { StyleSheet,} from 'react-native'
import React from 'react'
import HeaderBackButtonView from '../views/HeaderBackButtonView'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EventScreen({route, navigation}) {

  let {event} = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBackButtonView navigation={navigation} title={"Event"}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
  }
})