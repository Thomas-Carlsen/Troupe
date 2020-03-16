"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var options_js_1 = __importDefault(require("./options.js"));
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger("Lval");
var LVal = /** @class */ (function () {
    // is v never null? If not when put it in the type
    function LVal(v, l, tlev, posInfo) {
        var _this = this;
        if (tlev === void 0) { tlev = null; }
        if (posInfo === void 0) { posInfo = null; }
        debug(v, l, tlev, posInfo);
        this.val = v;
        this.lev = l;
        this.tlev = tlev == null ? l : tlev;
        this.posInfo = posInfo;
        this.stringRep = function (omitLevels, taintRef) {
            if (omitLevels === void 0) { omitLevels = false; }
            if (taintRef === void 0) { taintRef = null; }
            // Print value:
            var t = "";
            //if (v.stringRep != undefined) { // 2018-05-17; AA; ugly hack!
            if (v.hasOwnProperty("stringRep")) {
                t = v.stringRep(omitLevels, taintRef);
            }
            else if (typeof v === 'string') {
                t = "\"" + v.toString() + "\"";
            }
            else {
                t = v.toString();
            }
            // Print levels
            if (l.stringRep == undefined) {
                console.log("undefined strringrep", l);
            }
            // why is s necessary?
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
function debug(v, l, tlev, posInfo) {
    // Should probably devide the different checks of each var and concat the strings at the end
    // this is too messy now
    if (v != null) {
        if (tlev == null) {
            if (v.hasOwnProperty("toString")) {
                logger.debug("Created new LVal with val=" + v.toString() + ", level=" + l.stringRep() + ", tlev=" + tlev + ", posInfo=" + posInfo);
            }
            else if (v.hasOwnProperty("stringRep")) {
                logger.debug("Created new LVal with val=" + v.stringRep() + ", level=" + l.stringRep() + ", tlev=" + tlev + ", posInfo=" + posInfo);
            }
            else {
                logger.debug("Created new LVal with val=" + v + ", level=" + l.stringRep() + ", tlev=" + tlev + ", posInfo=" + posInfo);
            }
        }
        else if (v.hasOwnProperty("toString")) {
            logger.debug("Created new LVal with val=" + v.toString() + ", level=" + l.stringRep() + ", tlev=" + tlev.stringRep() + ", posInfo=" + posInfo);
        }
        else if (v.hasOwnProperty("stringRep")) {
            logger.debug("Created new LVal with val=" + v.stringRep() + ", level=" + l.stringRep() + ", tlev=" + tlev.stringRep() + ", posInfo=" + posInfo);
        }
        else {
            logger.debug("Created new LVal with val=" + v + ", level=" + l.stringRep() + ", tlev=" + tlev.stringRep() + ", posInfo=" + posInfo);
        }
    }
    else {
        if (tlev == null) {
            logger.debug("Created new LVal with val=" + v + ", level=" + l.stringRep() + ", tlev=" + tlev + ", posInfo=" + posInfo);
        }
        else {
            logger.debug("Created new LVal with val=" + v + ", level=" + l.stringRep() + ", tlev=" + tlev.stringRep() + ", posInfo=" + posInfo);
        }
    }
}
