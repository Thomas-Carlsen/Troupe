"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Authority = /** @class */ (function () {
    function Authority(authorityLevel) {
        this.authorityLevel = authorityLevel;
        this.stringRep = this.toString;
    }
    Authority.prototype.toString = function () {
        var x = this.authorityLevel.stringRep();
        return "!" + x;
    };
    return Authority;
}());
exports.Authority = Authority;
