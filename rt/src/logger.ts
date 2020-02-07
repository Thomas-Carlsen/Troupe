// 2018-07-21: AA; A very basic logging setup ... Not particularly attached to
// this library or this way of doing things, but this still beats console
// outputs. 

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  //  return `${info.timestamp} ${info.level}: ${info.message}`;
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const console = new transports.Console();

const mkLogger = (l, level='info') => createLogger({
  level : level, // comment out this file to remove debug messages
  format: combine(
    format.colorize(),

    
    label({ label: `${l}` }),
    timestamp(),
    myFormat
  ),
  transports: [console]
});

export { mkLogger };


// const log1 = mkLogger("logger 1");
// const log2 = mkLogger("logger 2");


// log1.info ('hello')
// log2.info ('bye')
