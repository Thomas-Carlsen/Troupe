const yargs = require('yargs');
const runtime = require('./runtimeMonitored');


// Each program has a constructor function Top which is exported
const Top = require(process.cwd() + "/" + yargs.argv.f);
const top = new Top (runtime.runtime);
runtime.start (top);

// make typescript believe this is a module
export{};
// will be change to import syntax later
