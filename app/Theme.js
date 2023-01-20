import Enum from "./Enum";

export default class Theme extends Enum{
    static ids = 0;

    static Health = new Theme("Good Health & Well-being", '#04a7e7');
    static Energy = new Theme("Affordable and Clean Energy", '#49cdee');
    static Development = new Theme("Sustainable Development", '#42e0ac');
    static Climate = new Theme("Climate Action", '#6cc743');
    static Life = new Theme("Life on Earth", '#4b892f');
    static Workshop = new Theme("Workshop", "#b45cf7");
    static Braindate = new Theme("Braindate", "#fa6464");
    static _ = this.closeEnum();

    constructor(name, color) {
        super(++Theme.ids);
        this.name = name;
        this.color = color;
    };

};