"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseKont = /** @class */ (function () {
    function BaseKont(f) {
        this.env = { ret: null };
        this.fun = f;
    }
    return BaseKont;
}());
exports.default = BaseKont;
