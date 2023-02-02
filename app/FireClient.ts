import BuildingLocation from "./BuildingLocation";
import EventList from "./EventList";
import Theme from "./Theme";
import { InPersonEvent, OnlineEvent } from './Event';
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

    allInPersonEvents: EventList;
    allOnlineEvents: EventList;
    themes: ThemeMap;
    locations: LocationMap;
    allInPersonEventsCallbacks: ((EventList) => void)[];
    allOnlineEventsCallbacks: ((EventList) => void)[];
    buildingsCollection: FirebaseFirestoreTypes.CollectionReference;
    themesCollection: FirebaseFirestoreTypes.CollectionReference;
    inPersonEventsCollection: FirebaseFirestoreTypes.CollectionReference;
    onlineEventsCollection: FirebaseFirestoreTypes.CollectionReference;
    authCallbacks: ((user: FirebaseAuthTypes.User) => void)[];
    user: FirebaseAuthTypes.User;
    userEvents: Array<number>;
    userEventsDoc: FirebaseFirestoreTypes.DocumentReference;
    userEventsDocSubscriber: () => void;
    userEventsCallbacks: ((EventList) => void)[];

    constructor() {
        this.allInPersonEvents = new EventList();
        this.allOnlineEvents = new EventList();
        this.userEvents = [];
        this.themes = {} as ThemeMap;
        this.locations = {} as LocationMap;
        this.allInPersonEventsCallbacks = [];
        this.allOnlineEventsCallbacks = [];
        this.buildingsCollection = firestore().collection("BuildingLocation");
        this.themesCollection = firestore().collection("Theme");
        this.inPersonEventsCollection = firestore().collection("InPersonEvent");
        this.onlineEventsCollection = firestore().collection("OnlineEvent");
        this.updateLocations = this.updateLocations.bind(this);
        this.updateThemes = this.updateThemes.bind(this);
        this.updateInPersonEvents = this.updateInPersonEvents.bind(this);
        this.updateOnLineEvents = this.updateOnLineEvents.bind(this);
        this.onAuthStatusChanged = this.onAuthStatusChanged.bind(this);
        this.authCallbacks = [];
        this.user = null;
        this.updateUserEvents = this.updateUserEvents.bind(this);
        this.userEventsCallbacks = [];
        this.userEventsDoc = null;
        this.userEventsDocSubscriber = null;
        auth().onAuthStateChanged(this.onAuthStatusChanged);
    }

    async onAuthStatusChanged(user: FirebaseAuthTypes.User) {
        this.user = user;
        if(user) {
            this.userEventsDoc = firestore().collection("UserEvent").doc(this.user.uid);
            await this.userEventsDoc.get().then(this.updateUserEvents);
            this.userEventsDocSubscriber = this.userEventsDoc.onSnapshot(this.updateInPersonEvents);
        }
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
        this.userEventsDocSubscriber();
        this.userEvents = [];
        this.userEventsDoc = null;
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
        this.allInPersonEvents = eventList;
        this.allInPersonEventsCallbacks.forEach(f => {f(eventList)});
    }

    updateOnLineEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, zoom} = documentSnapshot.data();
            
            let startDate = new Date();
            let endDate = new Date();
            this.timeStrToDate(startDate, startTime);
            this.timeStrToDate(endDate, endTime);
            
            eventList.addEvent(new OnlineEvent(id, this.themes[theme], topic, speaker, startDate, endDate, zoom));
        });
        this.allOnlineEvents = eventList;
        this.allOnlineEventsCallbacks.forEach(f => {f(eventList)});
    }

    getUserEventList(): EventList {
        let result = new EventList();
        this.userEvents.forEach(id => {
            let onLineEvent = this.allOnlineEvents.get(id);
            let inPersonEvent = this.allInPersonEvents.get(id);
            if(onLineEvent) {
                result.addEvent(onLineEvent);
            }
            else if(inPersonEvent) {
                result.addEvent(inPersonEvent);
            }
        });
        return result;
    }

    updateUserEvents(documentSnapshot: FirebaseFirestoreTypes.DocumentSnapshot) {
        if(documentSnapshot.exists) {
            let { userEvents } = documentSnapshot.data();
            this.userEvents = userEvents;
        }
        
        let eventList = this.getUserEventList();
        this.userEventsCallbacks.forEach(f => {f(eventList)});
    }

    registerUserEventsCallback(callback: ((events: EventList) => void)) {
        this.userEventsCallbacks.push(callback);
    }

    async getApplicationData(){
        await this.buildingsCollection.get().then(this.updateLocations);
        await this.themesCollection.get().then(this.updateThemes);
        await this.inPersonEventsCollection.get().then(this.updateInPersonEvents);
        await this.onlineEventsCollection.get().then(this.updateOnLineEvents);

        this.inPersonEventsCollection.onSnapshot(this.updateInPersonEvents);
        this.onlineEventsCollection.onSnapshot(this.updateOnLineEvents);
    }

    registerInPersonEventsCallback(f: (EventList: any) => void) {
        this.allInPersonEventsCallbacks.push(f);   
    }

    registerOnlineEventsCallback(f: (EventList: any) => void) {
        this.allOnlineEventsCallbacks.push(f);   
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