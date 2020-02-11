// 2018-07-21: AA; A very basic logging setup ... Not particularly attached to
// this library or this way of doing things, but this still beats console
// outputs. 

//import axios from "axios";
/*
const axios = require('axios').default;
let promise axios.get('http://localhost:3000/logger')
  .then(function (response) {
  })
  .catch(function (error) {
      //console.log(error);
  });
  */

/*
import { createLogger, format, transports } from 'winston';


const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  //  return `${info.timestamp} ${info.level}: ${info.message}`;
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const console = new transports.Console();

const mkLogger = (l:string, level:string='info') => {
  return createLogger({
    level : level, // comment out this file to remove debug messages
    format: combine(
      format.colorize(),    
      label({ label: `${l}` }),
      timestamp(),
      myFormat
    ),
    transports: [console]
  });
};
*/

import { createLogger } from './../bunyan.js';

const logger = createLogger({ name: 'my-logger' });

const mkLogger = (caller:string, level:string='info') => {
  return createLogger({ name: 'my-logger' , level: level});
};

// want to have a simple logger in the browser - TC
// level is either info or warning...
/*
const mkLogger = (caller:string, level:string='info') => {
  let logger = {
    info : (x) => console.log(`[${caller}] ${level}: ${x}`),
    error : (x) => console.log(`[${caller}] ${level}: ${x}`),
    debug : (x) => console.log(`[${caller}] ${level}: ${x}`)
  }
  return logger;
};
*/

export {mkLogger};
