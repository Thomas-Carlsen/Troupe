"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level = /** @class */ (function () {
    function Level(lev) {
        this.lev = lev;
        this.isLevel = true;
    }
    Level.prototype.stringRep = function () {
        return this.lev.toString();
    };
    return Level;
}());
exports.Level = Level;
