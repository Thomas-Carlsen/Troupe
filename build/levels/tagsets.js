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
    // have seen lev been assign to {} (when top) and new Set() (when bot)
    function TagLevel(lev) {
        return _super.call(this, lev) || this;
        //debug(`Created a new TagLevel: ${this.stringRep()}`);
    }
    TagLevel.prototype.stringRep = function () {
        // In case it is top level, which is an empty object
        if (isEmpty(this.lev))
            return "{}";
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
exports.TagLevel = TagLevel;
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
// l1 and l2 are of type TagLevel (the class above)
// since topLevel is based on an empty object and not set we donnot have forEach
// therefore we escape if any is topLevel.
function lub(l1, l2) {
    if (l1 == topLevel || l2 == topLevel) {
        return topLevel;
    }
    var tagset = new Set();
    l1.lev.forEach(function (tag) { return tagset.add(tag); });
    l2.lev.forEach(function (tag) { return tagset.add(tag); });
    //debug(`lub res:`)
    return new TagLevel(tagset);
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
    var tagset = new Set();
    var tags = str.split(',');
    tags.map(function (tag) {
        if (tag != '') {
            tagset.add(tag.trim().toLowerCase());
        }
    });
    return new TagLevel(tagset);
}
// Why is the level for top not an empty set instead of an empty object literal?
// Problem: You cannot .forEach on this object (used in stringRep)
var topLevel = new TagLevel({});
topLevel.stringRep = function () { return "{#TOP}"; };
topLevel.isTop = true;
var levels = {
    BOT: new TagLevel(new Set()),
    TOP: topLevel,
    lub: lub,
    glb: glb,
    flowsTo: flowsTo,
    mkLevel: fromString
};
exports.default = levels;
