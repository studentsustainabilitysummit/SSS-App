import BuildingLocation from "./BuildingLocation";
import EventList from "./EventList";
import Theme from "./Theme";
import { InPersonEvent, OnlineEvent, Event } from './Event';
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
    locationsList: Array<Location>
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
        this.locationsList = [];
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
        if(user && user.emailVerified) {
            this.userEventsDoc = firestore().collection("UserEvent").doc(this.user.uid);
            await this.userEventsDoc.get().then(this.updateUserEvents);
            this.userEventsDocSubscriber = this.userEventsDoc.onSnapshot(this.updateUserEvents);
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
        this.userEventsDocSubscriber && this.userEventsDocSubscriber();
        this.userEvents = [];
        this.userEventsDoc = null;
        await auth().signOut();
    }

    updateLocations(querySnapshot) {
        let locations = {} as LocationMap;
        let locationsList = [];
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {building, room, lat, lon} = documentSnapshot.data();
            let newLocation = new BuildingLocation(id, building, room, lat, lon);
            locations[id] = newLocation;
            locationsList.push(newLocation);
        });
        this.locations = locations;
        this.locationsList = locationsList;
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

    updateInPersonEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, location, bio, headshot, abstract} = documentSnapshot.data();
            eventList.addEvent(new InPersonEvent(id, this.themes[theme], topic, speaker, startTime.toDate(), endTime.toDate(), this.locations[location], bio, headshot, abstract));
        });
        this.allInPersonEvents = eventList;
        this.allInPersonEventsCallbacks.forEach(f => {f(eventList)});
        this.userEventsCallbacks.forEach(f => {f(this.getUserEventList())});
    }

    updateOnLineEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, zoom, bio, headshot, abstract} = documentSnapshot.data();
            eventList.addEvent(new OnlineEvent(id, this.themes[theme], topic, speaker, startTime.toDate(), endTime.toDate(), zoom, bio, headshot, abstract));
        });
        this.allOnlineEvents = eventList;
        this.allOnlineEventsCallbacks.forEach(f => {f(eventList)});
        this.userEventsCallbacks.forEach(f => {f(this.getUserEventList())});
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
        const unsubscribe = () => {
            let index = this.userEventsCallbacks.indexOf(callback);
            if(index >= 0) {
                this.userEventsCallbacks.splice(index, 1);
            }
        }
        return unsubscribe;
    }

    async enrollEvent(event: Event) {
        if(!this.user) {
            throw new Error("No user");
        }
        if(!this.userEvents.includes(event.id)) {
            let userEvents = [...this.userEvents];
            userEvents.push(event.id);
            await this.userEventsDoc.set({userEvents});
        }
    }

    async unEnrollEvent(event: Event) {
        if(!this.user) {
            throw new Error("No user");
        }
        let index = this.userEvents.indexOf(event.id);
        if(index >= 0) {
            let userEvents = [...this.userEvents];
            userEvents.splice(index, 1);
            await this.userEventsDoc.set({userEvents});
        }
    }

    async getApplicationData(){
        await this.buildingsCollection.get().then(this.updateLocations);
        await this.themesCollection.get().then(this.updateThemes);
        await this.inPersonEventsCollection.get().then(this.updateInPersonEvents);
        await this.onlineEventsCollection.get().then(this.updateOnLineEvents);

        this.inPersonEventsCollection.onSnapshot(this.updateInPersonEvents);
        this.onlineEventsCollection.onSnapshot(this.updateOnLineEvents);
    }

    registerInPersonEventsCallback(f: (EventList: any) => void): () => void {
        this.allInPersonEventsCallbacks.push(f);
        const unsubscribe = () => {
            let index = this.allInPersonEventsCallbacks.indexOf(f);
            if(index >= 0) {
                this.allInPersonEventsCallbacks.splice(index, 1);
            }
        }
        return unsubscribe;
    }

    registerOnlineEventsCallback(f: (EventList: any) => void) {
        this.allOnlineEventsCallbacks.push(f);
        const unsubscribe = () => {
            let index = this.allOnlineEventsCallbacks.indexOf(f);
            if(index >= 0) {
                this.allOnlineEventsCallbacks.splice(index, 1);
            }
        }
        return unsubscribe; 
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
