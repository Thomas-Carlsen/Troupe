"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger("Authority");
var Authority = /** @class */ (function () {
    function Authority(authorityLevel) {
        logger.debug("Authority created with authorityLevel " + authorityLevel.stringRep() + " and stringRep " + this.toString.name);
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
