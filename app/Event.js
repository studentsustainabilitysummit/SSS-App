export class Event {

    constructor(id, topic, name, startTime, endTime){
        if(this.constructor === Event) {
            throw new Error("Event class cannot be instantiated! Use InPersonEvent or OnlineEvent instead!");
        }
        this.id = id;
        this.topic = topic;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
    };

    overlaps(otherEvent) {
        if(this.startTime < otherEvent.startTime) {
            //This event starts before the other event does
            //The events will overlap the other event starts before this event ends
            return this.endTime > otherEvent.startTime;
        }
        else if(this.startTime > otherEvent.startTime) {
            //This event starts after the other event does
            //The events will overlap if this event starts before the other event ends
            return this.endTime < otherEvent.startTime;
        }
        else {
            //The two events start at the same time
            return true;
        }
    };

};

export class InPersonEvent extends Event {

    constructor(id, topic, name, startTime, endTime, location){
        super(id, topic, name, startTime, endTime);
        this.location = location;
    };

};

export class OnlineEvent extends Event {

    constructor(id, topic, name, startTime, endTime, zoom){
        super(id, topic, name, startTime, endTime);
        this.zoom = zoom;
    }

};