import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import FireClient from '../FireClient';
import HeaderView, {BackButtonView} from '../views/HeaderView';

const fireclient = FireClient.getInstance();

export default function LoginScreen({navigation}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>

    <HeaderView title={"Login"} leftComponent={<BackButtonView onPress={() => {navigation.goBack();}}/>}/>

      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      >
            
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
            style={styles.loginButton}
            onPress={() => {fireclient.login(email, password)}}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

      </KeyboardAvoidingView>

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
        marginBottom: 20
      },
      loginButton: {
        backgroundColor: "#04a7e7",
        width: "80%",
        borderRadius: 10,
        height: 60,
        marginTop: 30,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      buttonText: {
        color: "white",
        fontFamily: "LeagueSpartan",
        fontSize: 22
      },
})