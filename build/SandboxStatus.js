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
var NormalState = /** @class */ (function () {
    function NormalState() {
    }
    NormalState.prototype.isNormal = function () {
        return true;
    };
    NormalState.prototype.declassificationAllowed = function () {
        return true;
    };
    return NormalState;
}());
var InHandlerState = /** @class */ (function (_super) {
    __extends(InHandlerState, _super);
    function InHandlerState(f) {
        var _this = _super.call(this) || this;
        _this.trapper = f;
        return _this;
    }
    InHandlerState.prototype.isNormal = function () {
        return false;
    };
    InHandlerState.prototype.getTrapper = function () {
        return this.trapper;
    };
    InHandlerState.prototype.declassificationAllowed = function () {
        return false;
    };
    return InHandlerState;
}(NormalState));
var InSandboxState = /** @class */ (function (_super) {
    __extends(InSandboxState, _super);
    function InSandboxState(f) {
        var _this = _super.call(this) || this;
        _this.trapper = f;
        return _this;
    }
    InSandboxState.prototype.isNormal = function () {
        return false;
    };
    InSandboxState.prototype.getTrapper = function () {
        return this.trapper;
    };
    return InSandboxState;
}(NormalState));
var HandlerState = {
    NORMAL: NormalState,
    INHANDLER: InHandlerState,
    INSANDBOX: InSandboxState
};
exports.HandlerState = HandlerState;
