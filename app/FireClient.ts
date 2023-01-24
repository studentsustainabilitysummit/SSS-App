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
        this.allEvents = new EventList();
        this.userEvents = new EventList();
        this.themes = {} as ThemeMap;
        this.locations = {} as LocationMap;
    }

    async init(){

        function updateLocations(snapshot) {
            let client = FireClient.getInstance();
            let locations = {} as LocationMap;
            snapshot.forEach(l => {
                if(!l.val()) {
                    return undefined;
                }
                let id = l.key;
                let {building, room, lat, lon} = l.val();
                locations[id] = new BuildingLocation(id, building, room, lat, lon);
                return undefined;
            });
            client.locations = locations;
        }

        function updateThemes(snapshot) {
            let client = FireClient.getInstance();
            let themes = {} as ThemeMap;
            snapshot.forEach(t => {
                if(!t.val()) {
                    return undefined;
                }
                let id = t.key;
                let {name, color} = t.val();
                themes[id] = new Theme(name, color);
                return undefined;
            });
            client.themes = themes;
        }

        function timeStrToDate(date: Date, string: string) {
            let split = string.split(":");
            date.setHours(parseInt(split[0]));
            date.setMinutes(parseInt(split[1]));
            date.setSeconds(0);
        }

        function updateInPersonEvents(snapshot) {
            let client = FireClient.getInstance();
            let eventList = new EventList([], true);
            snapshot.forEach(e => {
                if(!e.val()) {
                    return undefined;
                }
                let id = e.key;
                let {theme, topic, speaker, startTime, endTime, location} = e.val();
                
                let startDate = new Date();
                let endDate = new Date();
                timeStrToDate(startDate, startTime);
                timeStrToDate(endDate, endTime);
                
                eventList.addEvent(new InPersonEvent(id, client.themes[theme], topic, speaker, startDate, endDate, client.locations[location]));
                
                return undefined;
            });
            client.allEvents = eventList;
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