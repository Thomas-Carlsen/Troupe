import {mkLogger} from './logger.js';
const logger = mkLogger('Level');
const debug = x => logger.debug(x);

export class Level {
  // I think lev is a Set type
  lev: any;
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
