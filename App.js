import MainScreen from './app/screens/MainScreen';
import FireClient from './app/FireClient';
import { Component } from 'react';
import * as Font from 'expo-font';
import LoginRegisterScreen from './app/screens/LoginRegisterScreen';
import VerifyUserScreen from './app/screens/VerifyUserScreen';

let customFonts = {
  LeagueSpartan: require('./app/assets/fonts/LeagueSpartan.ttf'),
};

export default class App extends Component{

  constructor(props) {
    super(props);
    this.fireclient = FireClient.getInstance();
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.fireclient.registerAuthStatusChangedCalback(this.handleAuthChange);
    this.state = {
      fontsLoaded: false,
      databaseLoaded: false,
      user: this.fireclient.user,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };

  async _databaseLoadAsync() {
    await this.fireclient.getApplicationData();
    this.setState({ databaseLoaded: true });
  };

  componentDidMount(){
    this._loadFontsAsync();
    this._databaseLoadAsync();
  }
    
  handleAuthChange(user) {
    this.setState({user});
  }

  render() {
    if(!this.state.fontsLoaded || !this.state.databaseLoaded) {
      return null;
    }

    if(!this.state.user)
    {
      return (
        <LoginRegisterScreen/>
      )
    }

    if(!this.state.user.emailVerified) {
      return (
        <VerifyUserScreen/>
      );
    }

    return (
      <MainScreen/>
    );
  }
}
