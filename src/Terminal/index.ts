import App from "../App";
import System from "../System";

export default class Termianl extends App{
    private _running: boolean;
    private _system: System;

    constructor(system:System){
        super("undefined", "undefined");

        this._running = true;
        this._system = system;

        //system.addApp(new Help());
        //system.addApp(new Reset());
        //system.addApp(new Exit());
        //system.addApp(new About());
        //system.addApp(new Settings(system.bios));

        system.callstack.push(this);
    }

    async main(system:System, args:any){
        while(this._running){
            system.print("\n$: ");
            let input = await system.getln();

            let cmd = input.split(/\s+/gm);
            this.addToHistory(input);

            let app = this._system.getApp(cmd[0]);

            if(app){
                system.callstack.push(app);
                await system.run(cmd);
                system.callstack.pop();
            } else {
                system.println("Unknown Command!");
            }
        }
    }

    run(){
        this._system.run({}).catch(console.error);
    }
}