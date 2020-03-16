"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger('Level');
var debug = function (x) { return logger.debug(x); };
var Level = /** @class */ (function () {
    function Level(lev) {
        debug("Created a new level with value " + lev.toString());
        this.lev = lev;
        this.isLevel = true;
    }
    Level.prototype.stringRep = function () {
        return this.lev.toString();
    };
    return Level;
}());
exports.Level = Level;
