import MainScreen from './app/screens/MainScreen';
import FireClient from './app/FireClient';
import { Component } from 'react';
import * as Font from 'expo-font';
import LoginScreen from './app/screens/LoginScreen';

let customFonts = {
  LeagueSpartan: require('./app/assets/fonts/LeagueSpartan.ttf'),
};

export default class App extends Component{

  state = {
    fontsLoaded: false,
    databaseLoaded: false,
    authenticated: false
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };

  async _databaseLoadAsync() {
    await FireClient.getInstance().init();
    this.setState({ databaseLoaded: true });
  };

  async _login(email, password) {
    
  }

  componentDidMount(){
    this._loadFontsAsync();
    this._databaseLoadAsync();
  }
    
  
  render() {
    if(!this.state.fontsLoaded || !this.state.databaseLoaded) {
      return null;
    }

    if(!this.state.authenticated)
    {
      return (
        <LoginScreen loginFn={this._login}/>
      )
    }

    return (
      <MainScreen/>
    );
  }
}
