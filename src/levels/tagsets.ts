import {mkLogger} from '../logger.js';
const logger = mkLogger('TAGSETS');
const info = x => logger.info(x)
const debug = x => logger.debug(x);

import { Level }  from '../Level.js'

class TagLevel extends Level {
    isTop: boolean;
    // have seen lev been assign to {} (when top) and new Set() (when bot)
    constructor (lev) {
        super(lev);
        debug(`Created a new TagLevel: ${this.stringRep()}`);
    }

    stringRep() {
        // In case it is top level, which is an empty object
        if (isEmpty(this.lev))
            return "{}";
        let n = this.lev.size
        let s = "{";
        let i = 0;
        this.lev.forEach( t => {
            s += t;
            if (++ i < n ) {
                s += ","
            }
        })
        s += "}"
        return s;
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function lub(l1, l2):any {
    if (l1 == topLevel || l2 == topLevel) {
        return topLevel;
    }

    let s = new Set();
    l1.lev.forEach(t => s.add(t));
    l2.lev.forEach(t => s.add(t));
    debug(`lub res:`)
    return new TagLevel(s);    
}

function glb(l1, l2):any {
    if (l1 == topLevel) {
        return l2;
    }

    if (l2 == topLevel ) {
        return l1;
    }

    let s = new Set();
    l1.lev.forEach (
        t => {
            if (l2.lev.has(t)) {
              s.add(t);
            }
        });
    return new TagLevel (s);
}

function flowsTo(l1, l2) {
    if (l2 == topLevel) {
        return true;
    }

    if (l1 == topLevel) {
      return (l2 == topLevel);
    }

    const iter = l1.lev.entries();
    for (let t1 of iter) {
        if (!l2.lev.has(t1[0])) {
          return false;
        }
    }

    return true;
}



function fromString(str2) {
    // debug (str2.toString())
    // the implementation is slightly over-protected
    // to deal with {} issues; 2018-09-19; AA

    const str1 = str2.trim();
    const str = str1.startsWith ("{") && str1.endsWith ("}") ?
               str1.substring(1, str1.length - 1) :
               str1;

    if (str == "#TOP") {
        return topLevel;
    }

    let s = new Set ();
    const tags = str.split(',');

    tags.map ( t => {
        if ( t != '') {
          s.add (t.trim().toLowerCase());
        }
    });
    return new TagLevel (s);
}


// Why is the level for top not an empty set instead of an empty object literal?
// Problem: You cannot .forEach on this object (used in stringRep)
let topLevel = new TagLevel({});
topLevel.stringRep = () => "{#TOP}"
topLevel.isTop = true;

let levels = {
    BOT: new TagLevel(new Set()),
    TOP: topLevel,
    lub: lub,
    glb: glb,
    flowsTo: flowsTo,
    mkLevel :fromString
}

export default levels;
