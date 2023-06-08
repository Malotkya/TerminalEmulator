/** Stream.ts
 * 
 */
import Bios from "./Bios";

/** Stream Class
 * 
 * This class acts like a stream to handle inputs and outputs.
 */
export default class Stream {
    private _buffer: string;

    constructor(){
        this._buffer = "";
    }

    private pull(index: number){
        if(index >= 0){
            let temp = this._buffer.substring(0, index);
            if(temp !== "")
                return temp;
        }
        return null;
    }

    add(s: string|Object){
        this._buffer += s;
    }

    remove(){
        this._buffer = this._buffer.slice(0, -1);
    }

    set(s: string){
        this._buffer = s;
    }

    clear(){
        this._buffer = "";
    }

    isReady(){
        return this._buffer.length !== 0;
    }

    flush(){
        let output = this._buffer;
        this._buffer = "";
        return output;
    }

    async get(char:string|undefined){
        while(true){
            let index = 1;
            if(char)
                index = this._buffer.indexOf(char[0]);
            let output = this.pull(index);

            if(output !== null)
                return output;

            await Bios.sleep();
        }
    }

    async getln(){
        while(true){
            let n = this._buffer.indexOf("\n");
            let r = this._buffer.indexOf("\r");

            let temp = this.pull(n);
            if(temp !== null){
                return temp;
            }

            temp = this.pull(r);
            if(temp !== null){
                return temp;
            }

            await Bios.sleep();
        }
    }
}