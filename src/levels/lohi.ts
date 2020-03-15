import {Level} from '../Level';

let LOW = new Level(0);
let HIGH = new Level(1);

let levels = {
    LOW: LOW,
    HIGH: HIGH,
    BOT: LOW,
    TOP: HIGH,
    lub: null,
    glb: null,
    flowsTo: null,
    mkLevel: null
};

levels.LOW.stringRep = () => "{public}"

levels.HIGH.stringRep = () => "{secret}"


levels.lub = (l1, l2) => {
    if (l1.lev > l2.lev)
        return l1;
    return l2;
}

levels.glb = (l1, l2) => {
    if (l1.lev > l2.lev)
        return l2;
    return l1;
}

levels.flowsTo = (l1, l2) => {
    return (l1.lev <= l2.lev);
}

levels.mkLevel = (x) => {
    if ( x === "secret" || x === "{secret}" ) {
        return levels.HIGH;
    } else {
        if ( x === "public" || x === "{public}" ) { 
            return levels.LOW
        }
        else {
            throw ("Level unknown:" + x)
        }
    }
}

export default levels;