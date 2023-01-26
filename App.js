import MainScreen from './app/screens/MainScreen';
import FireClient from './app/FireClient';
import { Component } from 'react';
import * as Font from 'expo-font';
import LoginScreen from './app/screens/LoginScreen';

let customFonts = {
  LeagueSpartan: require('./app/assets/fonts/LeagueSpartan.ttf'),
};

export default class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      databaseLoaded: false,
      user: null
    };
    this.fireclient = FireClient.getInstance();
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this._login = this._login.bind(this);
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };

  async _databaseLoadAsync() {
    await this.fireclient.getApplicationData();
    this.setState({ databaseLoaded: true });
  };

  async _login(email, password) {
    try {
      await this.fireclient.login(email, password); 
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount(){
    this._loadFontsAsync();
    this._databaseLoadAsync();
    this.fireclient.onAuthStateChanged(this.handleAuthChange);
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
        <LoginScreen loginFn={this._login}/>
      )
    }

    return (
      <MainScreen/>
    );
  }
}
