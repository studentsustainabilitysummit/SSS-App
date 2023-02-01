import BuildingLocation from "./BuildingLocation";
import EventList from "./EventList";
import Theme from "./Theme";
import { InPersonEvent } from './Event';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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
    allEventsCallbacks: ((EventList) => void)[];
    buildingsCollection: FirebaseFirestoreTypes.CollectionReference;
    themesCollection: FirebaseFirestoreTypes.CollectionReference;
    inPersonEventsCollection: FirebaseFirestoreTypes.CollectionReference;
    authCallbacks: ((user: FirebaseAuthTypes.User) => void)[];
    user: FirebaseAuthTypes.User;

    constructor() {
        this.allEvents = new EventList();
        this.userEvents = new EventList();
        this.themes = {} as ThemeMap;
        this.locations = {} as LocationMap;
        this.allEventsCallbacks = [];
        this.buildingsCollection = firestore().collection("BuildingLocation");
        this.themesCollection = firestore().collection("Theme");
        this.inPersonEventsCollection = firestore().collection("InPersonEvent");
        this.updateLocations = this.updateLocations.bind(this);
        this.updateThemes = this.updateThemes.bind(this);
        this.updateInPersonEvents = this.updateInPersonEvents.bind(this);
        this.onAuthStatusChanged = this.onAuthStatusChanged.bind(this);
        this.authCallbacks = [];
        this.user = null;
        auth().onAuthStateChanged(this.onAuthStatusChanged);
    }

    onAuthStatusChanged(user: FirebaseAuthTypes.User) {
        this.user = user;
        this.authCallbacks.forEach(f => {f(user)});
    }

    registerAuthStatusChangedCalback(callback: (user: FirebaseAuthTypes.User) => void) {
        this.authCallbacks.push(callback);
    }

    async sendVerificationEmail() {
        await this.user.sendEmailVerification();
        alert("Verification sent to email " + this.user.email + ".");
        await this.signOut();
    }

    async signOut() {
        await auth().signOut();
    }

    updateLocations(querySnapshot) {
        let locations = {} as LocationMap;
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {building, room, lat, lon} = documentSnapshot.data();
            locations[id] = new BuildingLocation(id, building, room, lat, lon);
        });
        this.locations = locations;
    }

    updateThemes(querySnapshot) {
        let themes = {} as ThemeMap;
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {name, color} = documentSnapshot.data();
            themes[id] = new Theme(name, color);
        });
        this.themes = themes;
    }

    timeStrToDate(date: Date, string: string) {
        let split = string.split(":");
        date.setHours(parseInt(split[0]));
        date.setMinutes(parseInt(split[1]));
        date.setSeconds(0);
    }

    updateInPersonEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, location} = documentSnapshot.data();
            
            let startDate = new Date();
            let endDate = new Date();
            this.timeStrToDate(startDate, startTime);
            this.timeStrToDate(endDate, endTime);
            
            eventList.addEvent(new InPersonEvent(id, this.themes[theme], topic, speaker, startDate, endDate, this.locations[location]));
        });
        this.allEvents = eventList;
        this.allEventsCallbacks.forEach(f => {f(eventList)});
    }

    async getApplicationData(){
        await this.buildingsCollection.get().then(this.updateLocations);
        await this.themesCollection.get().then(this.updateThemes);
        await this.inPersonEventsCollection.get().then(this.updateInPersonEvents);

        this.inPersonEventsCollection.onSnapshot(this.updateInPersonEvents);
    }

    registerAllEventsCallback(f: (EventList: any) => void) {
        this.allEventsCallbacks.push(f);   
    }

    async login(email: string, password: string) {
        if(email === "") {
            alert("Error: email cannot be blank");
            return;
        }
        if(password === "") {
            alert("Error: password cannot be blank");
            return;
        }
        try {
            return await auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert(error);
        }
    }

    async register(email: string, password: string) {
        if(email === "") {
            alert("Error: email cannot be blank");
            return;
        }
        if(password === "") {
            alert("Error: password cannot be blank");
            return;
        }
        try {
            return await auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            alert(error);
        }
    }

};