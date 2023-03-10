import { Image, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import React from 'react'

export default function HeaderView({title, leftComponent = null, rightComponent = null}) {
  return (
    <View style={styles.container}>
        <View style={styles.leftComponent}>
            {leftComponent}
        </View>
        <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
                {title}
            </Text>
        </View>
        <View style={styles.rightComponent}>
            {rightComponent}
        </View>
    </View>
  )
}

export function BackButtonView({onPress = {}}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={require('../assets/Back_button.png')} style={styles.logo}/>
        </TouchableOpacity>
    )
}

export function LogoView() {
    return (
        <Image source={require('../assets/SSSlogo1.png')} style={styles.logo}/>
    )
}

export function ToggleSwitchView({value=true, onPress={}}) {
    return (
        <View style={styles.switch}> 
            <Switch 
                trackColor={{false: '#04a7e7', true: '#6cc743'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#04a7e7"
                onValueChange={onPress}
                value={value}
            />
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
        backgroundColor: 'white',
    },
    title: {
        fontSize: 28,
        fontFamily: 'LeagueSpartan',
    },
    logo: {
        width: 100,
        height: 100,
    },
    leftComponent: {
        width: 100,
        height: 100
    },
    rightComponent: {
        width: 100,
        height: 100
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    switch: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
})