"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logger_js_1 = require("../logger.js");
var logger = logger_js_1.mkLogger('TAGSETS');
var info = function (x) { return logger.info(x); };
var debug = function (x) { return logger.debug(x); };
var Level_js_1 = require("../Level.js");
var TagLevel = /** @class */ (function (_super) {
    __extends(TagLevel, _super);
    function TagLevel(lev) {
        return _super.call(this, lev) || this;
    }
    TagLevel.prototype.stringRep = function () {
        var n = this.lev.size;
        var s = "{";
        var i = 0;
        this.lev.forEach(function (t) {
            s += t;
            if (++i < n) {
                s += ",";
            }
        });
        s += "}";
        return s;
    };
    return TagLevel;
}(Level_js_1.Level));
var topLevel = new TagLevel({});
topLevel.stringRep = function () { return "{#TOP}"; };
topLevel.isTop = true;
function lub(l1, l2) {
    // return topLevel;
    if (l1 == topLevel || l2 == topLevel) {
        return topLevel;
    }
    // debug (l1.lev.toString());
    // debug (l2);
    var s = new Set();
    l1.lev.forEach(function (t) { return s.add(t); });
    l2.lev.forEach(function (t) { return s.add(t); });
    return new TagLevel(s);
}
function glb(l1, l2) {
    if (l1 == topLevel) {
        return l2;
    }
    if (l2 == topLevel) {
        return l1;
    }
    var s = new Set();
    l1.lev.forEach(function (t) {
        if (l2.lev.has(t)) {
            s.add(t);
        }
    });
    return new TagLevel(s);
}
function flowsTo(l1, l2) {
    if (l2 == topLevel) {
        return true;
    }
    if (l1 == topLevel) {
        return (l2 == topLevel);
    }
    var iter = l1.lev.entries();
    for (var _i = 0, iter_1 = iter; _i < iter_1.length; _i++) {
        var t1 = iter_1[_i];
        if (!l2.lev.has(t1[0])) {
            return false;
        }
    }
    return true;
}
function fromString(str2) {
    // debug (str2.toString())
    // the implementation is slightly over-protected
    // to deal with {} issues; 2018-09-19; AA
    var str1 = str2.trim();
    var str = str1.startsWith("{") && str1.endsWith("}") ?
        str1.substring(1, str1.length - 1) :
        str1;
    if (str == "#TOP") {
        return topLevel;
    }
    var s = new Set();
    var tags = str.split(',');
    tags.map(function (t) {
        if (t != '') {
            s.add(t.trim().toLowerCase());
        }
    });
    return new TagLevel(s);
}
var levels = {
    BOT: new TagLevel(new Set()),
    TOP: topLevel,
    lub: lub,
    glb: glb,
    flowsTo: flowsTo,
    mkLevel: fromString
};
exports.default = levels;
