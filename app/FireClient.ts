import database from '@react-native-firebase/database';
import BuildingLocation from "./BuildingLocation";
import EventList from "./EventList";
import Theme from "./Theme";
import { InPersonEvent } from './Event';

interface ThemeMap {
    [index: number]: Theme;
}

interface LocationMap {
    [index: number]: BuildingLocation;
}

export default class FireClient {

    //Singleton
    static instance: FireClient = new FireClient;

    static getInstance(): FireClient {
        return this.instance;
    }

    allEvents: EventList;
    userEvents: EventList;
    themes: ThemeMap;
    locations: LocationMap;

    constructor() {

    }

    async init(){

        function updateLocations(snapshot) {
            let locations = {} as LocationMap;
            console.log('User data: ', snapshot.val());
            snapshot.forEach(l => {
                console.log(`User data: ${l.key}, value: ${l.val()}`);
                if(!l.val()) {
                    return undefined;
                }
                let id = l.key;
                let {building, room, lat, lon} = l.val();
                locations[id] = new BuildingLocation(id, building, room, lat, lon);
                return undefined;
            });
            this.locations = locations;
        }

        function updateThemes(snapshot) {
            let themes = {} as ThemeMap;
            console.log('User data: ', snapshot.val());
            snapshot.forEach(t => {
                console.log(`User data: ${t.key}, value: ${t.val()}`);
                if(!t.val()) {
                    return undefined;
                }
                let id = t.key;
                let {name, color} = t.val();
                themes[id] = new Theme(name, color);
                return undefined;
            });
            this.themes = themes;
        }

        function timeStrToDate(date: Date, string: string) {
            let split = string.split(":");
            date.setHours(parseInt(split[0]));
            date.setMinutes(parseInt(split[1]));
            date.setSeconds(0);
        }

        function updateInPersonEvents(snapshot) {
            let eventList = new EventList([], true);
            console.log('User data: ', snapshot.val());
            snapshot.forEach(e => {
                console.log(`User data: ${e.key}, value: ${e.val()}`);
                if(!e.val()) {
                    return undefined;
                }
                let id = e.key;
                let {theme, topic, speaker, startTime, endTime, location} = e.val();
                
                let startDate = new Date();
                let endDate = new Date();
                timeStrToDate(startDate, startTime);
                timeStrToDate(endDate, endTime);
                
                eventList.addEvent(new InPersonEvent(id, this.themes[theme], topic, speaker, startDate, endDate, this.locations[location]));
                
                return undefined;
            });
            this.allEvents = eventList;
        }

        await database()
        .ref("/BuildingLocation")
        .once("value", updateLocations);

        await database()
        .ref("/Theme")
        .once("value", updateThemes);

        await database()
        .ref("/InPersonEvent")
        .once("value", updateInPersonEvents);
    }

};