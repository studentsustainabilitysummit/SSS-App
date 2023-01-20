import Enum from "./Enum";

export default class Topic extends Enum{
    static ids = 0;

    static Health = new Topic("Good Health & Well-being", '#04a7e7');
    static Energy = new Topic("Affordable and Clean Energy", '#49cdee');
    static Development = new Topic("Sustainable Development", '#42e0ac');
    static Climate = new Topic("Climate Action", '#6cc743');
    static Life = new Topic("Life on Earth", '#4b892f');
    static _ = this.closeEnum();

    constructor(name, color) {
        super(++Topic.ids);
        this.name = name;
        this.color = color;
    };

};