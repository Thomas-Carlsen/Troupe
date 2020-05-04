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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors_js_1 = require("./colors.js");
var options_js_1 = __importDefault(require("./options.js"));
var Lval_js_1 = require("./Lval.js");
var ThreadError_js_1 = require("./ThreadError.js");
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger('Thread');
var debug = function (x) { return logger.debug(x); };
var lub = options_js_1.default.lub;
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
// class StackFrame {
//     pc: any;
//     ret: any;
//     constructor (pc, ret) {
//         this.pc = pc;
//         this.ret = ret;
//     }
// }
var Thread = /** @class */ (function () {
    function Thread(tid, ret, theFun, theArgs, namespace, pc, levblock, handlerState, rtObj) {
        this.tid = tid;
        this.pc = pc;
        this.bl = levblock;
        this.pinistack = [];
        this.pinidepth = 0;
        this.handlerState = handlerState;
        this.monitors = {};
        this.killCounter = 0;
        this.sleeping = false;
        this.timeoutObject = null;
        this.rtObj = rtObj;
        this._sp = 3;
        this.callStack = [pc, null, pc, ret]; // auxiliary bottom element of the call stack; never called
        // but is convenient for keeping track of the PC 
        this.mailbox = new Mailbox();
        this.next = function () {
            // Using apply will let namespace be 'this' in theFun
            // Example of namespace: the file itself (or the Top func in the file)
            console.log("next (fun) in thread: " + theFun);
            theFun.apply(namespace, theArgs);
        };
        // if (!pc) {
        //     console.trace();
        //     throw "PC is null"
        // }
        // if (!levblock) {
        //     console.trace();
        //     throw "blocking level undefined"
        // }
        // if (!this.blockinglev.length) {
        //     // console.log ("length of blocking lev", this.blockinglev.length);
        //     console.trace();
        //     throw "Blocking level is not an array";
        // }
        // if (handlerState == null ) {
        //     console.trace();
        //     throw "handler state is null"
        // }
    }
    Thread.prototype.exportState = function () {
        //throw "ERROR - not implemented" // 2019-05-08 
        var state = {
            pc: this.pc,
            bl: this.pc,
            pinistack: this.pinistack.slice(0),
            pinidepth: this.pinidepth,
            next: this.next,
            stackdepth: this.callStack.length
            // handlerState  : this.handlerState
        };
        return state;
    };
    Thread.prototype.importState = function (s) {
        //throw "ERRROR" // 2019-05-08 
        this.pc = s.pc;
        this.bl = s.bl;
        this.pinistack = s.pinistack.slice(0);
        this.pinidepth = s.pinidepth;
        this.next = s.next;
        var n = this.callStack.length - s.stackdepth;
        this.callStack.splice(-n, n);
        this._sp = s.stackdepth - 1;
        // this.handlerState  = s.handlerState
    };
    Thread.prototype.addMonitor = function (pid, r) {
        this.monitors[r.val] = { pid: pid, uuid: r };
    };
    Thread.prototype.tailInThread = function (theFun, arg1, arg2, nm) {
        this.next = function () {
            theFun.apply(nm, [arg1, arg2]);
        };
    };
    Thread.prototype.runNext = function (theFun, args, nm) {
        this.next = function () {
            theFun.apply(nm, args);
        };
    };
    Thread.prototype.retstep = function (arg) {
        this.rtObj.ret(arg);
    };
    Thread.prototype.block = function (cb) {
        this.next = function () {
            cb();
        };
    };
    Thread.prototype.callInThread = function (cb) {
        this.callStack.push(this.pc);
        this.callStack.push(cb);
        this._sp += 2;
    };
    Thread.prototype.returnInThread = function (arg) {
        debug("returnInThread: with pc=" + this.pc.stringRep());
        try {
            var rv_1 = new Lval_js_1.LVal(arg.val, lub(arg.lev, this.pc), lub(arg.tlev, this.pc));
            debug("returnInThread: Return val (rv) is " + rv_1.stringRep());
            debug("CallStack of this thread is " + this.callStack);
            var ret_1 = this.callStack.pop();
            this.pc = this.callStack.pop();
            this._sp -= 2;
            this.next = function () {
                ret_1(rv_1);
            };
        }
        catch (e) {
            console.log("Thread Error: in returnInThread");
            throw e;
        }
    };
    Thread.prototype.pcpush = function (l, cap) {
        this.raiseBlockingThreadLev(l.lev);
        this.pinidepth++;
        this.pinistack.unshift({ lev: this.bl, pc: this.pc, auth: l, cap: cap, purpose: 1 });
    };
    Thread.prototype.pcpop = function (arg) {
        if (this.pinidepth <= 0) {
            this.threadError("unmatched pcpop");
        }
        this.pinidepth--;
        var r = this.pinistack.shift();
        var lev = r.lev, pc = r.pc, auth = r.auth, cap = r.cap, purpose = r.purpose;
        // check the scopes
        if (arg.val != cap.val || purpose != 1) {
            this.threadError("Ill-scoped pinipush/pinipop");
            return; // does not schedule anything in this thread 
            // effectively terminating the thread
        }
        // We declassify the current blocking level to the old blocking level. 
        // and also the current pc to the old pc. 
        // We check that there is sufficient authority to go from the current blocking level
        // all the way down to the target pc 
        var levFrom = this.bl;
        var levTo = pc;
        debug("Level to declassify to at pinipop " + levTo.stringRep());
        // check that the provided authority is sufficient for the declassification
        var ok_to_declassify = options_js_1.default.flowsTo(levFrom, options_js_1.default.lub(auth.val.authorityLevel, levTo));
        if (ok_to_declassify) {
            this.pc = pc;
            this.bl = lev;
            // declassify the call stack...             
            var j = this._sp - 1;
            while (j >= 0 && !options_js_1.default.flowsTo(this.callStack[j], pc)) {
                this.callStack[j] = pc;
                j -= 2;
            }
            this.retstep(this.rtObj.__unit);
        }
        else {
            this.threadError("Not enough authority for pini declassification\n" +
                (" | from level of the blocking level: " + levFrom.stringRep() + "\n") +
                (" | level of the authority: " + auth.val.authorityLevel.stringRep() + "\n") +
                (" | to level of the blocking level: " + levTo.stringRep()));
        }
    };
    Thread.prototype.pinipush = function (auth, cap) {
        this.raiseBlockingThreadLev(auth.lev);
        this.pinidepth++;
        var obj = { lev: this.bl, pc: this.pc, auth: auth, cap: cap, purpose: 0 };
        this.pinistack.unshift(obj);
    };
    Thread.prototype.pinipop = function (arg) {
        if (this.pinidepth <= 0) {
            this.threadError("unmatched pinipop");
        }
        this.pinidepth--;
        var r = this.pinistack.shift();
        this.raiseBlockingThreadLev(this.pc); // maintaining the invariant that the blocking level is as high as the pc level       
        var lev = r.lev, auth = r.auth, cap = r.cap, purpose = r.purpose;
        // check the scopes
        if (arg.val != cap.val || purpose != 0) {
            this.threadError("Ill-scoped pinipush/pinipop");
            return; // does not schedule anything in this thread 
            // effectively terminating the thread
        }
        // If we are here then the pinipop is well-scoped
        // so we check the declassifications now
        var levFrom = this.bl;
        var levTo = lev;
        debug("Level to declassify to at pinipop " + levTo.stringRep());
        // check that the provided authority is sufficient to perform declassification to the next level
        var ok_to_declassify = options_js_1.default.flowsTo(levFrom, options_js_1.default.lub(auth.val.authorityLevel, levTo));
        if (ok_to_declassify) {
            this.bl = levTo;
            this.retstep(this.rtObj.__unit);
        }
        else {
            this.threadError("Not enough authority for pini declassification\n" +
                (" | from level of the blocking level: " + levFrom.stringRep() + "\n") +
                (" | level of the authority: " + auth.val.authorityLevel.stringRep() + "\n") +
                (" | to level of the blocking level: " + levTo.stringRep()));
        }
    };
    Thread.prototype.raiseBlockingThreadLev = function (l) {
        this.bl = lub(this.bl, l);
    };
    Thread.prototype.raiseCurrentThreadPCToBlockingLev = function (l) {
        this.pc = lub(this.pc, this.bl);
    };
    Thread.prototype.raiseCurrentThreadPC = function (l) {
        this.pc = lub(this.pc, l);
        this.raiseBlockingThreadLev(this.pc);
        // 2018-11-29: AA; observe that we are raise the blocking level
        // automaticaly every time we raise the PC level.
    };
    Object.defineProperty(Thread.prototype, "blockingTopLev", {
        get: function () {
            return this.bl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Thread.prototype, "joinedLev", {
        get: function () {
            return lub(this.blockingTopLev, this.pc);
        },
        enumerable: true,
        configurable: true
    });
    Thread.prototype.mkVal = function (x) {
        return new Lval_js_1.LVal(x, this.pc, this.pc);
    };
    Thread.prototype.mkValPos = function (val, pos) {
        return new Lval_js_1.LVal(val, this.pc, this.pc, pos);
    };
    Thread.prototype.mkValWithLev = function (x, l) {
        return new Lval_js_1.LVal(x, lub(this.pc, l), this.pc);
    };
    Thread.prototype.mkCopy = function (x) {
        console.log("mkCopy");
        return new Lval_js_1.LVal(x.val, lub(x.lev, this.pc), lub(x.tlev, this.pc));
    };
    Thread.prototype.printPc = function () {
        logger.error("PC: " + this.pc.stringRep());
        logger.error("BL: " + this.blockingTopLev.stringRep());
    };
    Thread.prototype.threadError = function (s, internal) {
        if (internal === void 0) { internal = false; }
        // 2018-12-07: AA; eventually the monitoring semantics may 
        // need to be put in here      
        if (this.handlerState.isNormal()) {
            logger.error(colors_js_1.red("Runtime error in thread " + this.tid.stringRep()));
            logger.error(colors_js_1.red(">> " + s));
            if (internal) {
                throw "ImplementationError";
            }
            else {
                throw new ThreadError_js_1.ThreadError(s);
            }
        }
        else {
            logger.warning(colors_js_1.yellow("runtime exception in the handler or sandbox: " + s));
            var f = this.handlerState.getTrapper();
            // assert and taint
            this.rtObj.assertIsFunction(f, true); //  the true flag indicates 
            // that this error should not be trapped because the exception mechanism is
            // internal to the runtime, so no assertions are normal here and therefore
            // their violation must be flagged as implementation bugs.
            this.raiseCurrentThreadPC(f.lev);
            console.log("handlerError");
            throw "HandlerError";
            // interrupt the execution, 
            // and pass the control to the the scheduler; that will schedule the
            // execution of the handler 
        }
    };
    Thread.prototype.addMessage = function (message) {
        this.mailbox.newMessage(message);
    };
    return Thread;
}());
exports.Thread = Thread;
