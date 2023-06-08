/*import Terminal from "./Terminal";
import System from "./System";
import App from "./App";

window.onload = () => {
    let sys: System = new System("#terminal");
    let t: Terminal = new Terminal(sys);

    sys.println("Welcome to AlexMalotky.com");
    sys.addApp(new Test());
    
    t.run();
}

class Test extends App {

    constructor(){
        super("Snake", "Used to test viewport");
    }

    async main(system: System, args: any){
        system.println("Comming Soon!");
    }
}*/
import System from "./System";

window.onload = () => {
    let system = new System("#terminal");
    console.log(system);
    system.println("Hello World!");
}