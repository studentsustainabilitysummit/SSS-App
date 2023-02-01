import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FireClient from '../FireClient';

const fireclient = FireClient.getInstance();

export default function RegisterScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
            <Image style={styles.image} source={require("../assets/SSSlogo1.png")}/>
            
            <View style={styles.inputView}> 
                <TextInput
                    style={styles.textInput}
                    placeholder='Email'
                    placeholderTextColor="white"
                    textAlign='center'
                    onChangeText={newEmail => {setEmail(newEmail)}}
                />
            </View>

            <View style={styles.inputView}> 
                <TextInput
                    style={styles.textInput}
                    placeholder='Password'
                    placeholderTextColor="white"
                    textAlign='center'
                    secureTextEntry={true}
                    onChangeText={newPass => {setPassword(newPass)}}
                />
            </View>

            <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => {fireclient.register(email, password)}}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      },
      inputView: {
        backgroundColor: '#6cc743',
        width: "60%",
        height: 50,
        alignItems: "center",
        marginBottom: 20,
        borderRadius: 10
      },
      textInput: {
        flex: 1,
        height: "auto",
        fontFamily: "LeagueSpartan",
        fontSize: 18,
        color: "white"
      },
      image: {
        height: 200,
        width: 200,
        marginBottom: 30
      },
      registerButton: {
        backgroundColor: "#fa6464",
        width: "80%",
        borderRadius: 10,
        height: 60,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"
      },
      buttonText: {
        color: "white",
        fontFamily: "LeagueSpartan",
        fontSize: 22
      },
})