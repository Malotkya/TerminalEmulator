/** System.ts
 * 
 * @author Alex Malotky
 */
import Bios from "./Bios";
import View from "./View";
import {InputStream, OutputStream} from "./Stream";
import App from "../App";
import { Key_Code, getKeyPressed } from "./Keyboard";

/** System Class
 * 
 */
export default class System {
    private _bios: Bios;

    private _callstack: Array<App>;
    private _apps: Map<string, App>;

    private _input: InputStream;
    private _output: OutputStream;

    private _protected: boolean;
    private _view: View | null;

    constructor(targetID: string){
        let target: HTMLElement = document.querySelector(targetID);
        if(target === null)
            throw new Error("Unable to find target: " + targetID);

        this._bios = new Bios(target, this);

        this._callstack = [];
        this._apps = new Map();

        this._input = new InputStream();
        this._output = new OutputStream();

        this._protected = false;
        this._view = null;
    }

    public println(s:string){
        this.print(s+'\n');
    }

    public print(s:string){
        this._output.add(s);
        this._input.clear();
    }

    public addFunction(call:string, description: string, callback: (s:System, a:any)=>Promise<void>){
        if( (typeof call === "string") && (typeof description === "string")
                && (typeof callback === "function") ){
            let buffer = new App(call, description);
            buffer.main = callback;

            this.addApp(buffer);
        }
    }

    public addApp(app: App){
        if(app instanceof App){
            if(this._apps.has(app.call))
                throw new Error("Call is already in use");

            this._apps.set(app.call, app);
        } else {
            throw new Error("Not an App!");
        }
    }

    public async run(args: any){
        this._output.clear();
        this._input.clear();

        let p = await this.current.main(this, args);
        if(this._view !== null){
            this._view?.delete();
        } else {
            this._output.clear();
        }
        return p;
    }

    get current(){
        return this._callstack[this._callstack.length-1];
    }

    get callstack(){
        return this._callstack;
    }

    getApp(call:string){
        return this._apps.get(call.toLowerCase());
    }

    event(key: Key_Code){
        switch(key){
            case Key_Code.BACK_SPACE:
                this._input.remove();
                break;
            
            case Key_Code.ARROW_UP:
            case Key_Code.ARROW_DOWN:
                let value: string = undefined;
                if(key == Key_Code.ARROW_UP)
                    value = this.current.moveHistory(-1);
                else
                    value = this.current.moveHistory(1);

                if(value)
                    this._input.set(value);
                break;

            case Key_Code.ENTER:
                if(!this._protected && this._view === null){
                    this._output.add(this._input.buffer);
                }
                this._input.clean();

            default:
                this._input.add( getKeyPressed(key) );
                break;
        }       
    }

    reset(){
        this._input.clear();
        this._output.clear();
    }

    close(){
        this._bios.shutdown();
    }

    async get(char: string = '/s'){
        return await this._input.get(char);
    }

    async getln(){
        return await this._input.getln();
    }

    async getPassord(){
        this._protected = true;
        let output: string = await this._input.getln();
        this._protected = false;
        return output;
    }

    async getView(){
        this._output.clear();

        while(!this._output.isReady()){
            await Bios.sleep();
        }
        this._view = new View(this._bios.view());
        return this._view;
    }

    render(){
        if(this._view !== null){
            this._bios.renderView(this._view);

            if(!this._view.running)
                this._view = null;
        } else {

            //Normal Render
            let x = this._bios.x;
            let y = this._bios.y;

            const output = (char: string) => {
                if(char == '\n' || char == '\r') {
                    x = 0;
                    y++;
                }  else {
                    this._bios.put(x,y,char);
                    x++;
                }


                if(x > this._bios.width) {
                    x = 0;
                    y++;
                }

                if(y > this._bios.totalHeight()) {
                    this._bios.grow();
                    this._bios.scroll(y);
                }
            }

            if(this._output.isReady()) {
                for(let char of this._output.flush()){
                    output(char);
                }
            }

            if( !this._protected) {
                for(let char of this._input.buffer){
                    output(char)
                }
            }

            this._bios.put(x, y, "█");
        }
    }
}