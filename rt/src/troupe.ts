import * as path from 'path';
let yargs = require('yargs');
import {mkRuntime, startRuntime} from './runtimeMonitored.js';

let p  = yargs.argv.f;
if (!path.isAbsolute(p))  {
    p = path.normalize ( process.cwd() + "/"+  p );
}

import(p).then(Top => {
    let top = new Top (mkRuntime())
    startRuntime(top);
});

/*
let Top = require(p);
// todo: define types for complied troupe programs
let top = new Top (runtime.runtime);
runtime.start (top);

export {};
*/