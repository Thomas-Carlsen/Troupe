"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { uuid as uuidv4} from './../../node_modules/uuidv4/build/lib/uuidv4.js';
var uuidv4 = require('uuid/v4');
var logger_js_1 = require("./logger.js");
var process_js_1 = __importDefault(require("./process.js"));
logger_js_1.mkLogger("Scheduler").debug("Imported process.js");
var BaseFunction_js_1 = require("./BaseFunction.js");
logger_js_1.mkLogger("Scheduler").debug("Imported BaseFunction.js");
var Lval_js_1 = require("./Lval.js");
logger_js_1.mkLogger("Scheduler").debug("Imported Lval.js");
var Thread_js_1 = require("./Thread.js");
logger_js_1.mkLogger("Scheduler").debug("Imported Thread.js");
var SandboxStatus_js_1 = require("./SandboxStatus.js");
logger_js_1.mkLogger("Scheduler").debug("Imported SandboxStatus.js");
var ThreadError_js_1 = require("./ThreadError.js");
logger_js_1.mkLogger("Scheduler").debug("Imported ThreadError.js");
var UnitBase_js_1 = require("./UnitBase.js");
logger_js_1.mkLogger("Scheduler").debug("Imported UnitBase.js");
var options_js_1 = __importDefault(require("./options.js"));
logger_js_1.mkLogger("Scheduler").debug("Imported options.js");
logger_js_1.mkLogger('Scheduler').debug("Imported modules");
var logger = logger_js_1.mkLogger('Scheduler');
var info = function (x) { return logger.info(x); };
var debug = function (x) { return logger.debug(x); };
var log = function (x) { return logger.log(x); };
var STACKDEPTH = 50;
var ProcessID = process_js_1.default.ProcessID;
var lub = options_js_1.default.lub;
var TerminationStatus = {
    OK: 0,
    ERR: 1
};
var Scheduler = /** @class */ (function () {
    function Scheduler(rt_uuid) {
        this.rt_uuid = rt_uuid;
        this.__funloop = new Array();
        this.__blocked = new Array();
        this.__alive = {}; // new Set();
        this.__currentThread = null; // current thread object
        this.stackcounter = 0;
        // the unit value 
        this.__unit = new Lval_js_1.LVal(UnitBase_js_1.theBaseUnit, options_js_1.default.BOT);
    }
    Scheduler.prototype.done = function (arg) {
        try {
            this.notifyMonitors();
            delete this.__alive[this.currentThreadId.val.toString()];
        }
        catch (e) {
            console.log("done error");
            throw e;
        }
    };
    Scheduler.prototype.halt = function (arg, persist) {
        if (persist === void 0) { persist = null; }
        try {
            this.raiseCurrentThreadPCToBlockingLev();
            var retVal = this.mkCopy(arg);
            this.notifyMonitors();
            delete this.__alive[this.currentThreadId.val.toString()];
            log(">>> Main thread finished with value: " + retVal.stringRep());
            if (persist) {
                this.rtObj.persist(retVal, persist);
                log("Saved the result value in file" + persist);
            }
        }
        catch (e) {
            console.log("halt error");
            throw e;
        }
    };
    Scheduler.prototype.notifyMonitors = function (status, errstr) {
        if (status === void 0) { status = TerminationStatus.OK; }
        if (errstr === void 0) { errstr = ""; }
        try {
            var ids = Object.keys(this.__currentThread.monitors);
            //console.log("notifyMonitors", ids);
            debug("notifyMonitors: ids=" + ids);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var toPid = this.__currentThread.monitors[id].pid;
                var refUUID = this.__currentThread.monitors[id].uuid;
                var thisPid = this.__currentThread.tid;
                var statusVal = this.__currentThread.mkVal(status);
                var reason = TerminationStatus.OK == status ? statusVal :
                    this.rtObj.mkTuple([statusVal, this.rtObj.mkVal(errstr)]);
                var message = this.rtObj.mkVal(this.rtObj.mkTuple([this.rtObj.mkVal("DONE"), refUUID, thisPid, reason]));
                this.rtObj.sendMessageNoChecks(toPid, message, false); // false flag means no need to return in the process
            }
        }
        catch (e) {
            console.log("notifyMonitors error");
            throw e;
        }
    };
    Scheduler.prototype.raiseCurrentThreadPC = function (l) {
        this.__currentThread.raiseCurrentThreadPC(l);
    };
    Scheduler.prototype.raiseCurrentThreadPCToBlockingLev = function (l) {
        this.__currentThread.raiseCurrentThreadPCToBlockingLev(l);
    };
    Scheduler.prototype.raiseBlockingThreadLev = function (l) {
        this.__currentThread.raiseBlockingThreadLev(l);
    };
    Scheduler.prototype.pinipush = function (l, cap) {
        this.__currentThread.pinipush(l, cap);
    };
    Scheduler.prototype.pinipop = function (cap) {
        return this.__currentThread.pinipop(cap);
    };
    Scheduler.prototype.mkVal = function (x) {
        return this.__currentThread.mkVal(x);
    };
    Scheduler.prototype.mkValPos = function (val, pos) {
        return this.__currentThread.mkValPos(val, pos);
    };
    Scheduler.prototype.mkCopy = function (x) {
        return this.__currentThread.mkCopy(x);
    };
    Scheduler.prototype.mkBase = function (f, name) {
        if (name === void 0) { name = null; }
        return new Lval_js_1.LVal(new BaseFunction_js_1.BaseFunction(f, name), options_js_1.default.BOT);
    };
    Scheduler.prototype.initScheduler = function (node, stopWhenAllThreadsAreDone, stopRuntime) {
        if (stopWhenAllThreadsAreDone === void 0) { stopWhenAllThreadsAreDone = false; }
        if (stopRuntime === void 0) { stopRuntime = function () { }; }
        debug("initScheduler: with nodeId " + node.nodeId + ", stopWhenAllThreadsAreDone " + stopWhenAllThreadsAreDone + " and stopRuntime " + stopRuntime.name);
        this.__node = node;
        this.__stopWhenAllThreadsAreDone = stopWhenAllThreadsAreDone;
        this.__stopRuntime = function () { stopRuntime(); };
    };
    Object.defineProperty(Scheduler.prototype, "pc", {
        /**
         * Returns the current thread's program counter
         * (updated on 2019-01-03; AA)
         */
        get: function () {
            return this.__currentThread.pc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scheduler.prototype, "blockingTopLev", {
        /**
         * Returns the curren thread's blocking lev
         */
        get: function () {
            return this.__currentThread.blockingTopLev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scheduler.prototype, "joinedLev", {
        /**
         * Returns the join of the current pc with the blocking lev
         */
        get: function () {
            return this.__currentThread.joinedLev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scheduler.prototype, "currentThreadId", {
        get: function () {
            return this.__currentThread.tid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scheduler.prototype, "handlerState", {
        get: function () {
            return this.__currentThread.handlerState;
        },
        set: function (st) {
            this.__currentThread.handlerState = st;
        },
        enumerable: true,
        configurable: true
    });
    Scheduler.prototype.resumeLoopAsync = function () {
        var _this = this;
        setImmediate(function () { _this.loop(); });
    };
    Scheduler.prototype.scheduleThreadT = function (t) {
        this.__funloop.push(t);
    };
    Scheduler.prototype.tail = function (thefun, arg1, arg2, nm) {
        try {
            this.__currentThread.tailInThread(thefun, arg1, arg2, nm);
            this.stepThread();
        }
        catch (e) {
            console.log("Scheduler tail Error");
            throw e;
        }
    };
    // Probably called from rt_ret
    Scheduler.prototype.returnInThread = function (arg) {
        this.__currentThread.returnInThread(arg);
        this.stepThread();
    };
    Scheduler.prototype.stepThread = function () {
        debug("stepThread: stackcounter=" + this.stackcounter + ", STACKDEPTH=" + STACKDEPTH);
        // console.log ( "FF ", this.__currentThread.theFun)
        if (this.stackcounter++ < STACKDEPTH) {
            this.__currentThread.next();
        }
        else {
            this.stackcounter = 0;
            this.scheduleThreadT(this.__currentThread);
        }
    };
    Scheduler.prototype.createNewProcessIDAtLevel = function (pcArg) {
        var pid = uuidv4();
        var pidObj = new ProcessID(this.rt_uuid, pid, this.__node);
        return new Lval_js_1.LVal(pidObj, pcArg);
    };
    // Example of inputs:
    // scheduleNewThreadAtLevel(file.main, [null, mainAuthority], file, levels.BOT, levels.BOT, true, persist);
    Scheduler.prototype.scheduleNewThreadAtLevel = function (thefun, args, namespace, levpc, levblock, ismain, persist) {
        var _this = this;
        if (ismain === void 0) { ismain = false; }
        if (persist === void 0) { persist = null; }
        var newPid = this.createNewProcessIDAtLevel(levpc);
        // Inside of halt was not been run after this
        var halt = ismain ? function (arg) { _this.halt(arg, persist); } :
            function (arg) { _this.done(arg); };
        var t = new Thread_js_1.Thread(newPid, halt, thefun, args, namespace, levpc, levblock, new SandboxStatus_js_1.HandlerState.NORMAL(), this.rtObj);
        this.__alive[newPid.val.toString()] = t;
        this.scheduleThreadT(t);
        return newPid;
    };
    Scheduler.prototype.schedule = function (thefun, args, nm) {
        this.__currentThread.runNext(thefun, args, nm);
        this.scheduleThreadT(this.__currentThread);
    };
    Scheduler.prototype.blockThread = function (t) {
        this.__blocked.push(t);
    };
    Scheduler.prototype.unblockThread = function (pid) {
        for (var i = 0; i < this.__blocked.length; i++) {
            if (process_js_1.default.pid_equals(this.__blocked[i].tid, pid)) {
                this.scheduleThreadT(this.__blocked[i]);
                this.__blocked.splice(i, 1);
                break;
            }
        }
    };
    Scheduler.prototype.isAlive = function (tid) {
        return (this.__alive[tid.val.toString()] != null);
    };
    Scheduler.prototype.getThread = function (tid) {
        return this.__alive[tid.val.toString()];
    };
    Scheduler.prototype.setRuntimeObject = function (rtObj) {
        this.rtObj = rtObj;
    };
    /*****************************************************************************\

    2018-02-18: AA: a hypothesis about memory management in V8

    It appears that V8's memory management is not very well suited for infinitely
    running functions. In other words, functions are expected to eventually
    terminate, and all long-running computations are  expected to run through the
    event loop. This is not surprising given the application where V8 is used.
    This is why we periodically yield to the event loop; this hack appears to let
    GC claim the objects allocated throughout the runtime of this function.  Note
    that without this hack, we are observing memory leaks for many "server"-like
    programs; with the hack, we get a waivy memory consumption profile that reaches
    around 50M on the low points of the wave.

    \*****************************************************************************/
    Scheduler.prototype.loop = function () {
        debug("running scheduler loop with " + this.__funloop.length + " many threads");
        var $$LOOPBOUND = 5000;
        for (var $$loopiter = 0; $$loopiter < $$LOOPBOUND && (this.__funloop.length > 0); $$loopiter++) {
            var next = this.__funloop.shift();
            console.log("New CurrentThread");
            this.__currentThread = next;
            //console.log("Does next have theFun???? - is it not a Thread?")
            //console.log(next.theFun);
            //let theFun = next.theFun; // This should not exist
            try {
                // This runs the function stored in the Thread
                this.__currentThread.next();
            }
            catch (e) {
                if (e instanceof ThreadError_js_1.ThreadError) {
                    // nothing to do in case it's just a thread error; 
                    // it's just important we do not resume
                    this.notifyMonitors(TerminationStatus.ERR, e.errstr);
                    delete this.__alive[this.currentThreadId.val.toString()];
                }
                else if (e == "HandlerError") {
                    // we have an error inside of an receive pattern or guard;
                    // we are discarding the rest of the current thread and are
                    // scheduling the execution of the handler 
                    //console.log("loop error: handlerError");
                    var f = this.handlerState.getTrapper().val;
                    this.__currentThread.tailInThread(f.fun, f.env, [], f.namespace);
                    this.scheduleThreadT(this.__currentThread);
                }
                else { // a real runtime error, must be a bug
                    console.log("Problems in the scheduler");
                    //console.log(theFun);
                    throw e;
                }
            }
        }
        debug("Executing threads loop is done - size=" + this.__funloop.length);
        if (this.__funloop.length > 0) {
            // we are not really done, but are just hacking around the V8's memory management
            this.resumeLoopAsync();
        }
        if (this.__stopWhenAllThreadsAreDone && Object.keys(this.__alive).length == 0) {
            this.__stopRuntime();
        }
    };
    return Scheduler;
}());
exports.default = Scheduler;
