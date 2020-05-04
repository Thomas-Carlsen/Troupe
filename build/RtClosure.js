"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RtClosure = /** @class */ (function () {
    function RtClosure(env, p, fun) {
        console.log("New Closure");
        this.env = env;
        this.fun = fun;
        this.namespace = p; // pointer. So we can fields of this object i.e. namespace
        this.stringRep = function (omitLevels) {
            if (omitLevels === void 0) { omitLevels = false; }
            return "fn => ..";
        };
    }
    return RtClosure;
}());
exports.RtClosure = RtClosure;
