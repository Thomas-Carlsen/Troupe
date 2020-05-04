import {mkLogger} from './logger.js';
const logger = mkLogger('Level');
const debug = x => logger.debug(x);

// A specific level to tag expressions i.e. a label
type Tagset = Set<string> | {};


export class Level {
  lev;
  isLevel: boolean;
    constructor(lev) {
      debug(`Created a new level with value ${lev.toString()}`);
      this.lev = lev;
      this.isLevel = true;
    }    

    stringRep() {
      return this.lev.toString();
    }

  }
