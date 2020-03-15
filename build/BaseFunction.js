"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFunction = /** @class */ (function () {
    function BaseFunction(f, name) {
        if (name === void 0) { name = null; }
        this.env = null;
        this.fun = f;
        this.stringRep = function () {
            if (name) {
                return "<basefun:" + name + ">";
            }
            else {
                return "<basefun:_>";
            }
        };
    }
    return BaseFunction;
}());
exports.BaseFunction = BaseFunction;
