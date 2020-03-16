import levels from './options.js';
import { Level } from "./Level.js";
import { mkLogger } from "./logger.js";

const logger = mkLogger("Lval");

export class LVal {
    val: any;
    lev: Level;
    tlev: Level;
    posInfo: string;
    stringRep: (omitLevels?: boolean, taintRef?: any) => string;

    // is v never null? If not when put it in the type
    constructor(v:any, l:Level, tlev:Level = null, posInfo:string = null) {
        debug(v, l, tlev, posInfo);
        this.val = v;
        this.lev = l;
        this.tlev = tlev == null ? l : tlev;
        this.posInfo = posInfo;

        this.stringRep = (omitLevels = false, taintRef = null) => {
            // Print value:
            let t = "";
            //if (v.stringRep != undefined) { // 2018-05-17; AA; ugly hack!
            if (v.hasOwnProperty("stringRep")) { 
                t = v.stringRep(omitLevels, taintRef)
            } else if (typeof v === 'string') {
                t = "\"" + v.toString() + "\""
            } else {
                t = v.toString();
            }
            
            // Print levels
            if (l.stringRep == undefined) {
                console.log("undefined strringrep", l);
            }
            // why is s necessary?
            let s = t;
            if (!omitLevels) {
                s = s + "@" + l.stringRep() + "%" + this.tlev.stringRep();
            }
            
            
            if (taintRef) {
                taintRef.lev = levels.lub(taintRef.lev, l);
            }
            
            return s;
        }
    }
}

function debug(v:any, l:Level, tlev:Level, posInfo:string) {
    // Should probably devide the different checks of each var and concat the strings at the end
    // this is too messy now
    if (v != null) {
        if (tlev == null){
            if (v.hasOwnProperty("toString")) {
                logger.debug(`Created new LVal with val=${v.toString()}, level=${l.stringRep()}, tlev=${tlev}, posInfo=${posInfo}`);
            } else if (v.hasOwnProperty("stringRep")) {
                logger.debug(`Created new LVal with val=${v.stringRep()}, level=${l.stringRep()}, tlev=${tlev}, posInfo=${posInfo}`);
            } else {
                logger.debug(`Created new LVal with val=${v}, level=${l.stringRep()}, tlev=${tlev}, posInfo=${posInfo}`);
            }

        } else if (v.hasOwnProperty("toString")) {
            logger.debug(`Created new LVal with val=${v.toString()}, level=${l.stringRep()}, tlev=${tlev.stringRep()}, posInfo=${posInfo}`);
        } else if (v.hasOwnProperty("stringRep")) {
            logger.debug(`Created new LVal with val=${v.stringRep()}, level=${l.stringRep()}, tlev=${tlev.stringRep()}, posInfo=${posInfo}`);
        } else {
            logger.debug(`Created new LVal with val=${v}, level=${l.stringRep()}, tlev=${tlev.stringRep()}, posInfo=${posInfo}`);
        }
    } else {
        if (tlev == null){
            logger.debug(`Created new LVal with val=${v}, level=${l.stringRep()}, tlev=${tlev}, posInfo=${posInfo}`);
        } else {
            logger.debug(`Created new LVal with val=${v}, level=${l.stringRep()}, tlev=${tlev.stringRep()}, posInfo=${posInfo}`);
        }
    }
}

