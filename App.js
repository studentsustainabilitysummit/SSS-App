import MainScreen from './app/screens/MainScreen';
import {useFonts} from 'expo-font';

export default function App() {

  const [loaded] = useFonts({
    LeagueSpartan: require('./app/assets/fonts/LeagueSpartan.ttf'),
  });

  if(!loaded) {
    return null;
  }

  return (
    <MainScreen/>
  );
}
