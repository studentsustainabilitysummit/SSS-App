import MainScreen from './app/screens/MainScreen';
import FireClient from './app/FireClient';
import { Component } from 'react';
import * as Font from 'expo-font';

let customFonts = {
  LeagueSpartan: require('./app/assets/fonts/LeagueSpartan.ttf'),
};

export default class App extends Component{

  state = {
    fontsLoaded: false,
    databaseLoaded: false
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async _databaseLoadAsync() {
    await FireClient.getInstance().init();
    this.setState({ databaseLoaded: true });
  };

  componentDidMount(){
    this._loadFontsAsync();
    this._databaseLoadAsync();
  }
    
  
  render() {
    if(!this.state.fontsLoaded || !this.state.databaseLoaded) {
      return null;
    }
    return (
      <MainScreen/>
    );
  }
}
