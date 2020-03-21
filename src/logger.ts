import {term} from './term.js';

class Logger {
    caller : string
    level : string
    constructor(caller:string, level:string) {
        this.caller = caller;
        this.level = level;
    }
    //use unpack ...args
    log(mess:string) {
        term.write(mess + "\n");
        if (this.level = 'debug') 
            console.log("log:" + this.caller + ": " + mess);
    }
    info(mess:string) {
        //console.info(this.caller + ": " + mess);
        term.write(this.caller + ": " + mess + "\n");
    }
    debug(mess:string) {
        return;
        if (this.level == 'debug') {
            term.write("debug:" + this.caller + ": " + mess + "\n");
            //console.log("debug:" + this.caller + ": " + mess);
            //console.debug(this.caller + ": " + mess);
        }
        
    }
    error(mess:string) {
        // errors in term will be added in later
        //term.write("error:" + this.caller + ": " + mess);
        console.error(this.caller + ": " + mess);
    }
}

export function mkLogger(caller:string, level="debug") {
    return new Logger(caller, level);
}