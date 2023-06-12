/** Stream.ts
 * 
 */
import Bios from "./Bios";

/** Stream Class
 * 
 * This class acts like a stream to handle inputs and outputs.
 */
export default class Stream {
    protected _buffer: string;

    public constructor(){
        this._buffer = "";
    }

    protected pull(index: number){
        if(index >= 0){
            let temp = this._buffer.substring(0, index);
            if(temp !== "")
                return temp;
        }
        return null;
    }

    public add(s: string|Object){
        this._buffer += s;
    }

    public remove(){
        this._buffer = this._buffer.slice(0, -1);
    }

    public set(s: string){
        this._buffer = s;
    }

    public clear(){
        this._buffer = "";
    }

    public isReady(){
        return this._buffer.length !== 0;
    }

    public flush(){
        let output = this._buffer;
        this._buffer = "";
        return output;
    }
}

export class InputStream extends Stream {
    public flush() {
        return this._buffer;
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

export class OutputStream extends Stream {
    
}