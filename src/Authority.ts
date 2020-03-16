import { Level } from "./Level.js";
import { mkLogger } from "./logger.js";
const logger = mkLogger("Authority");

export class Authority {
    authorityLevel: Level;
    stringRep: () => string;
    constructor (authorityLevel: Level) {
        logger.debug(`Authority created with authorityLevel ${authorityLevel.stringRep()} and stringRep ${this.toString.name}`)
        this.authorityLevel = authorityLevel
        this.stringRep = this.toString;
    }

    toString () {
        let x = this.authorityLevel.stringRep();
        return "!" + x;
    } 
}

