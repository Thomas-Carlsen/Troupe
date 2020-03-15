"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RtClosure = /** @class */ (function () {
    function RtClosure(e, p, f) {
        this.env = e;
        this.fun = f;
        this.namespace = p;
        this.stringRep = function (omitLevels) {
            if (omitLevels === void 0) { omitLevels = false; }
            return "fn => ..";
        };
    }
    return RtClosure;
}());
exports.RtClosure = RtClosure;
