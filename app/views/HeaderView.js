import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function HeaderView({title}) {
  return (
    <View style={styles.container}>
        <Image source={require('../assets/SSSlogo1.png')} style={styles.logo}/>
        <Text style={styles.title}>
            {title}
        </Text>
    </View>
  )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontFamily: 'LeagueSpartan',
    },
    logo: {
        width: 100,
        height: 100,
        position: "absolute",
        top: 0,
        left: 10,
    },
})