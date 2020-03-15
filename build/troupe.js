"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var yargs = require('yargs');
var runtimeMonitored_js_1 = require("./runtimeMonitored.js");
var p = yargs.argv.f;
if (!path.isAbsolute(p)) {
    p = path.normalize(process.cwd() + "/" + p);
}
Promise.resolve().then(function () { return __importStar(require(p)); }).then(function (Top) {
    var top = new Top(runtimeMonitored_js_1.mkRuntime());
    runtimeMonitored_js_1.startRuntime(top);
});
/*
let Top = require(p);
// todo: define types for complied troupe programs
let top = new Top (runtime.runtime);
runtime.start (top);

export {};
*/ 
