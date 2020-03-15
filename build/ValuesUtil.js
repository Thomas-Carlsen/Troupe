"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isListFlagSet(x) {
    return (x.isList == true);
    /*
    console.log (x)
    if (x) return (x==true);
    return false;
    */
}
exports.isListFlagSet = isListFlagSet;
function isTupleFlagSet(x) {
    // return true;
    return (x.isTuple == true);
}
exports.isTupleFlagSet = isTupleFlagSet;
