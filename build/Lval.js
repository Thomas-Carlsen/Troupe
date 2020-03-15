"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var options_js_1 = __importDefault(require("./options.js"));
var LVal = /** @class */ (function () {
    function LVal(v, l, tlev, posInfo) {
        var _this = this;
        if (tlev === void 0) { tlev = null; }
        if (posInfo === void 0) { posInfo = null; }
        this.val = v;
        this.lev = l;
        this.tlev = tlev == null ? l : tlev;
        this.posInfo = posInfo;
        this.stringRep = function (omitLevels, taintRef) {
            if (omitLevels === void 0) { omitLevels = false; }
            if (taintRef === void 0) { taintRef = null; }
            var t = "";
            if (v.stringRep != undefined) { // 2018-05-17; AA; ugly hack!
                t = v.stringRep(omitLevels, taintRef);
            }
            else {
                if (typeof v === 'string') {
                    t = "\"" + v.toString() + "\"";
                }
                else {
                    t = v.toString();
                }
            }
            if (l.stringRep == undefined) {
                console.log("undefined strringrep", l);
            }
            var s = t;
            if (!omitLevels) {
                s = s + "@" + l.stringRep() + "%" + _this.tlev.stringRep();
            }
            if (taintRef) {
                taintRef.lev = options_js_1.default.lub(taintRef.lev, l);
            }
            return s;
        };
    }
    return LVal;
}());
exports.LVal = LVal;
