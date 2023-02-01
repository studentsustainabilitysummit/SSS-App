import { StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const Stack = createNativeStackNavigator();

function MainMenu({navigation}) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Image style={styles.image} source={require("../assets/SSSlogo1.png")}/>

      <TouchableOpacity 
      style={styles.loginButton}
      onPress={() => {navigation.navigate("Login")}}
      >
          <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.registerButton}
      onPress={() => {navigation.navigate("Register")}}
      >
          <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

export default function LoginRegisterScreen() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="MainMenu"
            component={MainMenu}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
      loginButton: {
        backgroundColor: "#04a7e7",
        width: "80%",
        borderRadius: 10,
        height: 60,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      registerButton: {
        backgroundColor: "#fa6464",
        width: "80%",
        borderRadius: 10,
        height: 60,
        justifyContent: "center",
        alignItems: "center"
      },
      buttonText: {
        color: "white",
        fontFamily: "LeagueSpartan",
        fontSize: 22
      },
})