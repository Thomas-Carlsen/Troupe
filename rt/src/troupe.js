let yargs = require('yargs');


let runtime = require ('./runtimeMonitored');

// Each program has a constructor function Top which is exported
let Top = require(process.cwd() + "/" + yargs.argv.f);
let top = new Top (runtime.runtime);
runtime.start (top);
