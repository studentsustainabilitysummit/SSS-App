import { Event } from "./Event";

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
};