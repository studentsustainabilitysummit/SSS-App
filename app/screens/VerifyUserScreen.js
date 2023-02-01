import { StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FireClient from '../FireClient'

export default function VerifyUserScreen() {

    const fireclient = FireClient.getInstance();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
                <Image style={styles.image} source={require("../assets/SSSlogo1.png")}/>
    
                <Text style={styles.text}>Your Email {fireclient.user.email} has not been verified</Text>

                <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => {fireclient.sendVerificationEmail()}}
                >
                    <Text style={styles.buttonText}>Send Verification Email</Text>
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
      text: {
        color: "black",
        fontFamily: "LeagueSpartan",
        fontSize: 22,
        textAlign: "center",
      },
})