import BuildingLocation from "./BuildingLocation";
import EventList from "./EventList";
import Theme from "./Theme";
import { InPersonEvent, OnlineEvent, Event } from './Event';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Message from './Message'

interface ThemeMap {
    [index: number]: Theme;
}

interface LocationMap {
    [index: number]: BuildingLocation;
}

class MessageUpdater {
    messages: Array<Message>
    callback: (messages: Message[]) => any;
    event: Event;
    constructor(callback, event) {
        this.messages = [];
        this.event = event;
        this.updateMessage = this.updateMessage.bind(this);
        firestore().collection("Messages").doc(event.id).collection("Messages").onSnapshot(this.updateMessage);
        this.callback = callback;
    }

    setCallback(newCallback: (messages: Message[]) => any) {
        this.callback = newCallback;
    }
    
    updateMessage(querySnapshot) {
        const newMessages = [];
        let update = false || this.messages.length === 0;
        
        querySnapshot.forEach(documentSnapshot => {
            const id = documentSnapshot.id;
            const {sender, time, content} = documentSnapshot.data();
            const m = new Message(id, sender, time.toDate(), content);
            let messageIsNew = true;
            this.messages.forEach(oldMessage => {
                if(oldMessage.id === id) {
                    messageIsNew = false;
                }
            });
            update = update || messageIsNew;
            newMessages.push(m);
        });
        
        if(update){
            this.messages = newMessages;
            const compareFn = (a: Message, b: Message) => {
                return a.time - b.time;
            }
            this.messages.sort(compareFn);
            this.doCallback();
        }
    }

    doCallback() {
        this.callback(this.messages);
    }

};

interface MessageUpdaterMap{
    [index: number]: MessageUpdater;
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
    messageUpdaters: MessageUpdaterMap;

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
        this.messageUpdaters = {} as MessageUpdaterMap;
    }

    async onAuthStatusChanged(user: FirebaseAuthTypes.User) {
        this.user = user;
        if(user) {
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

    updateInPersonEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, location} = documentSnapshot.data();
            eventList.addEvent(new InPersonEvent(id, this.themes[theme], topic, speaker, startTime.toDate(), endTime.toDate(), this.locations[location]));
        });
        this.allInPersonEvents = eventList;
        this.allInPersonEventsCallbacks.forEach(f => {f(eventList)});
        this.userEventsCallbacks.forEach(f => {f(this.getUserEventList())});
    }

    updateOnLineEvents(querySnapshot) {
        let eventList = new EventList([], true);
        querySnapshot.forEach(documentSnapshot => {
            let id = documentSnapshot.id;
            let {theme, topic, speaker, startTime, endTime, zoom} = documentSnapshot.data();
            eventList.addEvent(new OnlineEvent(id, this.themes[theme], topic, speaker, startTime.toDate(), endTime.toDate(), zoom));
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

    async sendMessage(event: Event, content: string): Promise<Message> {
        if(!this.user) {
            throw new Error("Cannot send message when not authenticated");
        }
        const sender = this.user.email;
        const time = new Date();
        const docReference = await firestore().collection("Messages").doc(event.id).collection("Messages").add({sender, time, content})
        const m = new Message(docReference.id, sender, time, content);
        return m;
    }

    registerMessagesCallback(event: Event, callback: ((messages: Message[]) => void), messages: Message[]) {
        if(!this.messageUpdaters[event.id]) {
            const updater = new MessageUpdater(callback, event);
            this.messageUpdaters[event.id] = updater;
        } else {
            this.messageUpdaters[event.id].setCallback(callback);
            if(messages.length === 0) {
                this.messageUpdaters[event.id].doCallback();
            }
        }
        
        return () => {
            this.messageUpdaters[event.id].setCallback(messages => {});
        };
    }

};
