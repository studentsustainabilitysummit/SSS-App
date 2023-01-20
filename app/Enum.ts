export default class Enum{

    static enumKeys: Array<number>;
    static enumValues: Array<Enum>;

    static closeEnum() {
        this.enumKeys = [];
        this.enumValues = [];
        for(const [key, value] of Object.entries(this))
        {
            if(key !== "ids")
            {
                this.enumKeys.push(value.id);
                this.enumValues.push(value);
            }
        }
    }

    static get(id: number):undefined|Enum {
        const index = this.enumKeys.indexOf(id);
        if (index >= 0) {
            return this.enumValues[index];
        }
        return undefined;
    };

    id: number;

    constructor(id: number) {
        this.id = id
    }

};