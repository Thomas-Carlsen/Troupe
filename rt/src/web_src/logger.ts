

class Logger {
    caller : string
    constructor(caller:string) {
        this.caller = caller;
    }
    info(mess:string) {
        console.log(this.caller + ": " + mess);
    }
    debug(mess:string) {
        console.log(this.caller + ": " + mess);
    }
    error(mess:string) {
        console.error(this.caller + ": " + mess);
    }
}

export function mkLogger(caller:string, level="info") {
    

}