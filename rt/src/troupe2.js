let runt = require('./runtimeMonitored.js');
console.log(process.argv[2]);
let Top = require("./" + process.argv[2]);
let top = Top(runt.mkRuntime());
runt.startRuntime(top);