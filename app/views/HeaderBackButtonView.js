import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function HeaderBackButtonView({title, navigation}) {
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <Image source={require('../assets/Back_button.png')} style={styles.logo}/>
        </TouchableOpacity>
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
        alignItems: 'center',
        backgroundColor: 'white'
    },
    title: {
        fontSize: 30,
        fontFamily: 'LeagueSpartan',
    },
    logo: {
        width: 100,
        height: 100,
    },
    button: {
        position: "absolute",
        top: 0,
        left: 10,
    },
})