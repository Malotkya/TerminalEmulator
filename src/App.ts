import System from "./System"

interface History{
    list: Array<string>,
    location: number;
}

export default class App{
    private _call: string;
    private _description: string;

    private _history: History;

    constructor(call: string, description: string){
        this._call = call.toLowerCase();
        this._description = description;

        this._history = {
            list: [],
            location: -1
        }
    }

    protected moveHistory(it: number){
        if(this._history.list.length > 0) {
            this._history.location += it;

            if(this._history.location < 0) {
                this._history.location = 0;
            }

            if(this._history.location >= this._history.list.length) {
                this._history.location = this._history.list.length-1;
            }

            return this._history.list[this._history.location];
        }

        return null;
    }

    protected addToHistory(s:string){
        this._history.list.push(s);
        this._history.location = this._history.list.length;
    }

    public main(system: System, args: any){
        system.println("Hello World!");
    }

    get call(){
        return this._call;
    }
    get description(){
        return this._description;
    }
}