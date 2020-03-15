"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level_1 = require("../Level");
var LOW = new Level_1.Level(0);
var HIGH = new Level_1.Level(1);
var levels = {
    LOW: LOW,
    HIGH: HIGH,
    BOT: LOW,
    TOP: HIGH,
    lub: null,
    glb: null,
    flowsTo: null,
    mkLevel: null
};
levels.LOW.stringRep = function () { return "{public}"; };
levels.HIGH.stringRep = function () { return "{secret}"; };
levels.lub = function (l1, l2) {
    if (l1.lev > l2.lev)
        return l1;
    return l2;
};
levels.glb = function (l1, l2) {
    if (l1.lev > l2.lev)
        return l2;
    return l1;
};
levels.flowsTo = function (l1, l2) {
    return (l1.lev <= l2.lev);
};
levels.mkLevel = function (x) {
    if (x === "secret" || x === "{secret}") {
        return levels.HIGH;
    }
    else {
        if (x === "public" || x === "{public}") {
            return levels.LOW;
        }
        else {
            throw ("Level unknown:" + x);
        }
    }
};
exports.default = levels;
