export class Event {

    constructor(id, theme, topic, speaker, startTime, endTime){
        if(this.constructor === Event) {
            throw new Error("Event class cannot be instantiated! Use InPersonEvent or OnlineEvent instead!");
        }
        this.id = id;
        this.theme = theme;
        this.topic = topic;
        this.speaker = speaker;
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

    getTimeRangeString() {
        let result = '';
        
        let startHours = this.startTime.getHours();
        let startMinutes = this.startTime.getMinutes();
        let endHours = this.endTime.getHours();
        let endMinutes = this.endTime.getMinutes();

        //Forgive me for what I am about to write
        result += startHours > 12? startHours - 12 : startHours;
        if(startMinutes !== 0){
            result += ':' + startMinutes.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
            });
        }
        if(endHours >= 12 && startHours < 12)
        {
            result += startHours < 12? 'AM' : 'PM';
        }
        result += ' - ';
        result += endHours > 12? endHours - 12 : endHours;
        if(endMinutes !== 0){
            result += ':' + endMinutes.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
            });
        }
        result += endHours < 12? 'AM' : 'PM';

        return result;
    }

};

export class InPersonEvent extends Event {

    constructor(id, theme, topic, speaker, startTime, endTime, location){
        super(id, theme, topic, speaker, startTime, endTime);
        this.location = location;
    };

};

export class OnlineEvent extends Event {

    constructor(id, theme, topic, speaker, startTime, endTime, zoom){
        super(id, theme, topic, speaker, startTime, endTime);
        this.zoom = zoom;
    }

};