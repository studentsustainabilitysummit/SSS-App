import { Event, InPersonEvent, OnlineEvent } from "./Event";

export default class EventList {
    array: Array<Event>;
    allowOverlapping: boolean

    constructor(array?: Array<Event>, allowOverlapping:boolean = false){
        this.allowOverlapping = allowOverlapping;
        if(array){
            for(let i = 0; i < array.length && !allowOverlapping; i++) {
                for(let j = i + 1; j < array.length; j++) {
                    if(array[i].overlaps(array[j])) {
                        throw new Error("Event " + array[i].id + " overlaps with event " + array[j].id);
                    }
                }
            }
            this.array = array;
            this.sort();
        }
        else {
            this.array = [];
        }
    };

    addEvent(newEvent: Event) {
        if(!this.allowOverlapping) {
            this.array.forEach(element => {
                if(element.overlaps(newEvent)) {
                    throw new Error("Event " + newEvent.id + " overlaps with event " + element.id);
                }
            });
        }
        this.array.push(newEvent);
        this.sort();
    }

    removeEvent(event: Event) {
        let index = this.array.indexOf(event);
        if(index >= 0) {
            this.array.splice(index, 1);
        }
        //Assuming array is already in order we don't have to sort if only one item is removed
    }

    forEach(fn: (value: Event, index: number, array: Event[]) => void) {
        this.array.forEach(fn);
    }

    sort() {
        function comparefn(a: Event, b: Event) {
            let dStart = a.startTime - b.startTime;
            return dStart === 0 ? a.endTime - b.endTime : dStart;
        }
        this.array.sort(comparefn);
    }

    get(id: number): Event {
        let result = null;
        this.forEach((event) => {
            if(event.id === id) {
                result = event;
            }
        })
        return result;
    }

    contains(event: Event): boolean {
        let result = false;
        this.array.forEach(e => {
            if(e.id === event.id) {
                result = true;
            }
        })
        return result;
    }

    getInPerson() : EventList {
        const result = new EventList([], this.allowOverlapping);
        this.array.forEach(e => {
            if(e instanceof InPersonEvent) {
                result.addEvent(e);
            }
        });
        return result;
    }

    getOnline() : EventList {
        const result = new EventList([], this.allowOverlapping);
        this.array.forEach(e => {
            if(e instanceof OnlineEvent) {
                result.addEvent(e);
            }
        });
        return result;
    }
};