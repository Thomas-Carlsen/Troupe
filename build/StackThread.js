'use strict';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __importDefault(require("./options"));
var StackCallItem_1 = require("./StackCallItem");
var lub = options_1.default.lub;
var BlockingLev = /** @class */ (function () {
    function BlockingLev() {
    }
    return BlockingLev;
}());
var Mailbox = /** @class */ (function (_super) {
    __extends(Mailbox, _super);
    function Mailbox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mailbox.prototype.newMessage = function (x) {
        this.push(x);
    };
    return Mailbox;
}(Array));
var Thread = /** @class */ (function () {
    function Thread(tid, blockinglev, retStackItem, handlerState) {
        this.tid = tid;
        this.blockinglev = blockinglev;
        this.threadstack = [retStackItem];
        this.handlerState = handlerState;
        this.mailbox = new Mailbox();
        this.next = null;
    }
    Thread.prototype.tail = function (f, arg) {
        this.next = function () {
            f(arg);
        };
    };
    Thread.prototype.call = function (f) {
        this.threadstack.push(new StackCallItem_1.StackCallItem(this.pc, f));
    };
    Thread.prototype.returnInThread = function (arg) {
        var stackItem = this.threadstack.shift();
        if (!(stackItem instanceof StackCallItem_1.StackCallItem)) {
            this.threadError("invalid stack state");
            return;
        }
        var stackCallItem = stackItem;
        this.pc = stackCallItem.pc;
        this.next = function () {
            stackCallItem.f(arg);
        };
    };
    Thread.prototype.threadError = function (s) {
        console.error(s);
    };
    Thread.prototype.pinipush = function (l, cap) {
        this.blockingdepth++;
        this.blockinglev.unshift({ lev: this.blockinglev[0].lev, auth: l, cap: cap });
    };
    Thread.prototype.pinipop = function (cap) {
        this.blockingdepth--;
        if (this.blockingdepth <= 0) {
            this.threadError("unmatched pinipop");
        }
        var r = this.blockinglev.shift();
        return r;
    };
    Thread.prototype.raiseBlockingThreadLev = function (l) {
        // OBS: 2019-02-27: important that we create a new object;
        // otherwise we get into aliasing issues when saving/restoring
        // thread state in sandboxing; AA 
        this.blockinglev[0] = { lev: lub(this.blockinglev[0].lev, l),
            auth: this.blockinglev[0].auth,
            cap: this.blockinglev[0].cap
        };
    };
    Thread.prototype.raiseCurrentThreadPCToBlockingLev = function () {
        this.pc = lub(this.pc, this.blockinglev[0].lev);
    };
    Thread.prototype.raiseCurrentThreadPC = function (l) {
        this.pc = lub(this.pc, l);
        this.raiseBlockingThreadLev(this.pc);
        // 2018-11-29: AA; observe that we are raise the blocking level
        // automaticaly every time we raise the PC level.
    };
    return Thread;
}());
exports.Thread = Thread;
