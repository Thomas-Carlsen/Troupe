"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External module
var colors = require('./colors.js');
var uuidv4 = require('uuid/v4');
// have to substitute the below with xtermjs
var fs = require('fs');
//const yargs = require('yargs');
/*
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
*/
var promisify = require('util').promisify;
// Internal runtime modules
var logger_js_1 = require("./logger.js");
logger_js_1.mkLogger("RTM").debug("Importing internal modules");
var RtClosure_js_1 = require("./RtClosure.js");
logger_js_1.mkLogger("RTM").debug("Imported RtClosure.js");
var ValuesUtil_js_1 = require("./ValuesUtil.js");
logger_js_1.mkLogger("RTM").debug("Imported ValuesUtil.js");
// an attempt to modularize the runtime; 2018-07-16; AA
//
var Scheduler_js_1 = __importDefault(require("./Scheduler.js"));
logger_js_1.mkLogger("RTM").debug("Imported Scheduler.js");
var Lval_js_1 = require("./Lval.js");
logger_js_1.mkLogger("RTM").debug("Imported Lval.js");
var process_js_1 = __importDefault(require("./process.js"));
logger_js_1.mkLogger("RTM").debug("Imported process.js");
var MailboxProcessor_js_1 = require("./MailboxProcessor.js");
logger_js_1.mkLogger("RTM").debug("Imported MailboxProcessor.js");
var NodeManager_js_1 = require("./NodeManager.js");
logger_js_1.mkLogger("RTM").debug("Imported NodeManager.js");
var loadLibs_js_1 = __importDefault(require("./loadLibs.js"));
logger_js_1.mkLogger("RTM").debug("Imported loadLibs.js");
var BaseFunction_js_1 = require("./BaseFunction.js");
logger_js_1.mkLogger("RTM").debug("Imported BaseFunction.js");
var SandboxStatus_js_1 = require("./SandboxStatus.js");
logger_js_1.mkLogger("RTM").debug("Imported SandboxStatus.js");
var Authority_js_1 = require("./Authority.js");
logger_js_1.mkLogger("RTM").debug("Imported Authority.js");
var options_js_1 = __importDefault(require("./options.js"));
logger_js_1.mkLogger("RTM").debug("Imported options.js");
var Level_js_1 = require("./Level.js");
logger_js_1.mkLogger("RTM").debug("Imported Level.js");
var UnitBase_js_1 = require("./UnitBase.js");
logger_js_1.mkLogger("RTM").debug("Imported UnitBase.js");
var serialize_js_1 = __importDefault(require("./serialize.js"));
logger_js_1.mkLogger("RTM").debug("Imported serialize.js");
var p2p_js_1 = require("./p2p/p2p.js");
logger_js_1.mkLogger("RTM").debug("Imported p2p.js");
logger_js_1.mkLogger("RTM").debug("Imported modules in runtime");
// GLOBALS
var __sched;
var __theMailbox;
var aliases;
var __nodeManager;
var localNode;
//const readFile = promisify (fs.readFile);
var rt_uuid = uuidv4();
//logs
var logLevel = 'debug'; //yargs.argv.debug?'debug':'info';
var logger = logger_js_1.mkLogger('RTM', logLevel);
var error = function (x) { return logger.error(x); };
var info = function (x) { return logger.info(x); };
var debug = function (x, err) { return logger.debug(x); };
var log = function (mess) { return logger.log(mess); };
//todo: change this to termjs
var lineBuffer = [];
var readlineCallbacks = [];
var levels = options_js_1.default;
var lub = levels.lub;
var glb = levels.glb;
var flowsTo = levels.flowsTo;
var ProcessID = process_js_1.default.ProcessID;
var _allowRemoteSpawn = false;
var __p2pRunning = false;
// these are initialized later in webServerReady handler
// once we get information from the webserver about the
// port on which we are listening...
var __theRegister = {};
var _trustMap = {};
var rtObj = null;
var mkBase;
var rt_ret;
var rt_mkVal;
var rt_mkValPos;
var rt_mkCopy;
var rt_debug;
var rt_nodeFromProcess;
var rt_raiseTrust;
var rt_attenuate;
var rt_declassify;
var rt_toStringLabeled;
var rt_toString;
var rt_getTime;
var rt_print;
var rt_printWithLabels;
var rt_printString;
var rt_writeString;
var rt_inputline;
var rt_question;
var rt_self;
var rt_send;
var rt_spawn;
var rt_sleep;
var rt_sandbox;
var rt_restore;
var rt_save;
var rt_receive;
var rt_rcvp;
var rt_rcv;
//   // this.mkSecret = mkBase(baseMkSecret);
//   // this.adv = mkBase(baseDisclose);
var rt_register;
var rt_whereis;
var rt_exit;
var __unit;
// My Features
var rt_localStorageWrite;
var rt_localStorageRead;
var rt_localStorageDelete;
var raiseCurrentThreadPC;
var raiseCurrentThreadPCToBlockingLev;
var raiseCurrentBlockingThreadLev;
var currentThreadPid;
debug("Created GLOBALS");
// CLASSES 
var RtEnv = /** @class */ (function () {
    function RtEnv() {
        // this.ret = __sched.ret;
    }
    return RtEnv;
}());
var LibEnv = /** @class */ (function () {
    function LibEnv() {
        this.ret = null;
    }
    return LibEnv;
}());
debug("Created CLASSES");
// FUNCTIONS
function lineListener(input) {
    if (readlineCallbacks.length > 0) {
        var cb = readlineCallbacks.shift();
        cb(input);
    }
    else {
        lineBuffer.push(input);
    }
}
//readline.on ('line', lineListener)
//term.on('line', lineListener);
function lubs(x) {
    if (x.length == 0) {
        return levels.BOT;
    }
    else {
        var r = x[0];
        for (var i = 1; i < x.length; i++) {
            r = lub(r, x[i]);
        }
        return r;
    }
}
;
// --------------------------------------------------
function spawnAtNode(nodeid, f) {
    return __awaiter(this, void 0, void 0, function () {
        var node, _a, data, level, trustLevel, theThread, body1, body, pid, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    node = __nodeManager.getNode(nodeid.val);
                    _a = serialize_js_1.default.serialize(f, lub(__sched.pc, nodeid.lev)), data = _a.data, level = _a.level;
                    trustLevel = nodeTrustLevel(node.nodeId);
                    if (!flowsTo(level, trustLevel)) {
                        threadError("Illegal trust flow when spawning on a remote node\n" +
                            (" | the trust level of the recepient node: " + trustLevel.stringRep() + "\n") +
                            (" | the level of the information in spawn: " + level.stringRep()));
                    }
                    theThread = __sched.__currentThread;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, localNode.spawnp2p(node.nodeId, data)];
                case 2:
                    body1 = _b.sent();
                    return [4 /*yield*/, serialize_js_1.default.deserializeAsync(nodeTrustLevel(node.nodeId), body1)];
                case 3:
                    body = _b.sent();
                    pid = new ProcessID(body.val.uuid, body.val.pid, body.val.node);
                    theThread.returnInThread(new Lval_js_1.LVal(pid, body.lev));
                    __sched.scheduleThreadT(theThread);
                    __sched.resumeLoopAsync();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    debug("error spawning remotely; this blocks current thread" + err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function remoteSpawnOK() {
    return _allowRemoteSpawn;
}
/**
 *
 * This function is invoked when someone spawns a thread
 * on our node.
 *
 * @param {*} jsonObj
 *    The payload function.
 *
 * @param {*} rtcb
 *    The callback to the networking runtime (e.g., p2p subsystem)
 *    that we invoke with the newly generated process id. This is
 *    needed to communicate the new pid to the spawner.
 *
 * @param {*} fromNode
 *    The identity of the node that initiates the spawning.
 */
function spawnFromRemote(jsonObj, fromNode) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeLev, lf, f, newPid, serObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeLev = nodeTrustLevel(fromNode);
                    return [4 /*yield*/, serialize_js_1.default.deserializeAsync(nodeLev, jsonObj)];
                case 1:
                    lf = _a.sent();
                    f = lf.val;
                    newPid = __sched.scheduleNewThreadAtLevel(f.fun, [f.env, __unit], f.namespace, lf.lev, lf.lev);
                    serObj = serialize_js_1.default.serialize(newPid, levels.BOT).data;
                    __sched.resumeLoopAsync();
                    return [2 /*return*/, (serObj)];
            }
        });
    });
}
function rt_raisedToLev(x, y) {
    return new Lval_js_1.LVal(x.val, lub(x.lev, y));
}
function persist(obj, path) {
    // todo-api: localhost/../serialize
    var jsonObj = serialize_js_1.default.serialize(obj, __sched.pc).data;
    fs.writeFileSync(path, JSON.stringify(jsonObj));
}
/**
 * This function is called when someone sends us a message.
 *
 * @param {*} pid
 *    The process id of the sender
 * @param {*} jsonObj
 *    The payload
 * @param {*} fromNode
 *    The node identity of the sender node
 */
function receiveFromRemote(pid, jsonObj, fromNode) {
    return __awaiter(this, void 0, void 0, function () {
        var data, fromNodeId, toPid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serialize_js_1.default.deserializeAsync(nodeTrustLevel(fromNode), jsonObj)
                    // debug ("* rt receiveFromremote * " + fromNode);
                    // TODO: 2018-07-23: do we need to do some more raising
                    // about the level of the fromNode?; AA
                ];
                case 1:
                    data = _a.sent();
                    fromNodeId = __sched.mkVal(fromNode);
                    toPid = new Lval_js_1.LVal(new ProcessID(rt_uuid, pid, __nodeManager.getLocalNode()), data.lev);
                    __theMailbox.addMessage(fromNodeId, toPid, data.val, data.lev);
                    __sched.resumeLoopAsync();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Sends the provided mesasge to a remote process, first doing the information
 * flow check that the remote process is not going to violate our trust
 * assumptions.
 *
 * @param {*} toPid   The pid of the remote process
 * @param {*} message The data to send
 *
 */
function sendMessageToRemote(toPid, message) {
    var node = toPid.node.nodeId;
    var pid = toPid.pid;
    // debug ("* rt *", toPid, message);
    // todo-api: localhost/../serialize
    var _a = serialize_js_1.default.serialize(new Lval_js_1.LVal(message, __sched.pc), __sched.pc), data = _a.data, level = _a.level;
    var trustLevel = nodeTrustLevel(node);
    // debug ("data level: " +  level.stringRep());
    // debug ("remote trust level: " + trustLevel.stringRep());
    if (!flowsTo(level, trustLevel)) {
        threadError("Illegal trust flow when sending information to a remote node\n" +
            (" | the trust level of the recepient node: " + trustLevel.stringRep() + "\n") +
            (" | the level of the information to send:  " + level.stringRep()));
    }
    else {
        localNode.sendp2p(node, pid, data);
        rt_ret(__unit); // we return unit to the call site at the thread level
    }
}
function isLocalPid(pid) {
    var x = pid.uuid.toString() == rt_uuid.toString();
    return (x);
}
function rt_mkuuid() {
    var pid = uuidv4();
    var uuidval = rt_mkVal(pid);
    return uuidval;
}
function rt_sendMessageNochecks(lRecipientPid, message, ret) {
    if (ret === void 0) { ret = true; }
    var recipientPid = lRecipientPid.val;
    if (isLocalPid(recipientPid)) {
        var nodeId = __sched.mkVal(__nodeManager.getNodeId());
        __theMailbox.addMessage(nodeId, lRecipientPid, message, __sched.pc);
        if (ret) {
            rt_ret(__unit);
        }
    }
    else {
        // debug ("* rt rt_send remote *", recipientPid, message);
        sendMessageToRemote(recipientPid, message);
    }
}
//////// INIT ////////
function initRuntime() {
    var _this = this;
    debug("Initializing");
    __sched = new Scheduler_js_1.default(rt_uuid);
    debug("Initialized Scheduler i.e. __sched");
    __theMailbox = new MailboxProcessor_js_1.MailboxProcessor(__sched);
    debug("Initialized MailboxProcessor i.e. __theMailbox");
    //todo: fix yargs
    aliases = {}; /*yargs.argv.aliases
                    ? JSON.parse ( fs.readFileSync(yargs.argv.aliases))
                    : {}*/
    __nodeManager = new NodeManager_js_1.NodeManager(levels, aliases); // 2019-01-03: todo: use options; AA
    debug("Initialized NodeManager i.e. __nodeManager");
    mkBase = function (f, name) {
        if (name === void 0) { name = null; }
        return __sched.mkBase(f, name);
    };
    rt_mkVal = function (x) { return __sched.mkVal(x); };
    rt_mkValPos = function (val, pos) { return __sched.mkValPos(val, pos); };
    rt_mkCopy = function (x) { return __sched.mkCopy(x); };
    raiseCurrentThreadPC = function (l) { return __sched.__currentThread.raiseCurrentThreadPC(l); };
    raiseCurrentThreadPCToBlockingLev = function (l) { return __sched.__currentThread.raiseCurrentThreadPCToBlockingLev(l); };
    raiseCurrentBlockingThreadLev = function (l) { return __sched.__currentThread.raiseBlockingThreadLev(l); };
    currentThreadPid = function () { return __sched.currentThreadId; };
    __unit = __sched.__unit;
    rt_self = mkBase(function (env, arg) {
        // debug ("* rt self", currentPid);
        rt_ret(currentThreadPid());
    }, "self");
    rt_sleep = mkBase(function (env, arg) {
        assertIsNumber(arg);
        var delay = arg.val;
        var theThread = __sched.__currentThread;
        theThread.sleeping = true;
        theThread.timeoutObject =
            setTimeout(function () {
                __sched.__currentThread = theThread; // probably unnecessary because we don't create any labeled values here.
                theThread.sleeping = false;
                theThread.timeoutObject = null;
                theThread.returnInThread(__unit);
                __sched.scheduleThreadT(theThread);
                __sched.resumeLoopAsync();
            }, delay);
    }, "sleep");
    rt_sandbox = mkBase(function (env, arg) {
        assertIsNTuple(arg, 2);
        var theThread = __sched.__currentThread;
        var threadState = theThread.exportState();
        var done = false;
        var trapperInvoked = false;
        var delay = arg.val[0];
        var retVal = null;
        raiseCurrentThreadPC(delay.lev);
        function mk_tupleVal(x) {
            return theThread.mkVal(rt_mkTuple(x));
        }
        function ok(x, l) {
            var statusOk = __sched.__currentThread.mkValWithLev(true, l);
            var y = rt_raisedToLev(x, l);
            return mk_tupleVal([statusOk, y]);
        }
        function bad(x, l) {
            var statusBad = __sched.__currentThread.mkValWithLev(false, l);
            var y = rt_raisedToLev(x, l);
            return mk_tupleVal([statusBad, y]);
        }
        setTimeout(function () {
            theThread.handlerState = new SandboxStatus_js_1.HandlerState.NORMAL();
            var resultLabel = __sched.blockingTopLev;
            // Restore the state back to what it was before starting the sandboxing
            theThread.importState(threadState);
            // __sched.raiseCurrentThreadPCToBlockingLev();
            // 2019-01-31: AA; obs: this is subtle
            // we check whether the thread is no longer scheduled
            if (done || trapperInvoked || theThread.sleeping) {
                if (done) {
                    theThread.returnInThread(ok(retVal, resultLabel));
                }
                else {
                    if (theThread.sleeping) {
                        theThread.sleeping = false;
                        clearTimeout(theThread.timeoutObject);
                    }
                    theThread.returnInThread(bad(__unit, resultLabel));
                }
                // because the thread has finished, we need 
                // to push it back into the thread pool
                __sched.scheduleThreadT(theThread);
                __sched.resumeLoopAsync();
            }
            else {
                theThread.killCounter++;
                // the thread is alive and is somewhere in the scheduler queue, so
                // we just change its return kont
                theThread.returnInThread(bad(__unit, resultLabel));
            }
        }, delay.val);
        /*
        let barrierClosure = new RtClosure ({ret:null}, null, (env, arg) => {
          retVal = arg;
          done = true;
        });
        */
        var guard = function (arg) {
            retVal = arg;
            done = true;
        };
        var trapper = mkBase(function (env, arg) {
            trapperInvoked = true;
            retVal = __unit;
        });
        // __sched.setret (barrierClosure);
        __sched.__currentThread.callInThread(guard);
        theThread.handlerState = new SandboxStatus_js_1.HandlerState.INSANDBOX(trapper);
        theThread.barrierdepth = 0;
        rt_tailcall(arg.val[1], __unit);
    }, "sandbox");
    rt_spawn = mkBase(function (env, larg) {
        assertNormalState("spawn");
        // debug ("* rt rt_spawn *", larg.val, larg.lev);
        raiseCurrentThreadPC(larg.lev);
        var arg = larg.val;
        function spawnLocal(arg) {
            // debug ("scheduled rt_spawn ", arg.fun);
            var newPid = __sched.scheduleNewThreadAtLevel(arg.fun, [arg.env, __unit], arg.namespace, __sched.pc, __sched.blockingTopLev);
            rt_ret(newPid);
        }
        if (Array.isArray(arg)) {
            if (__nodeManager.isLocalNode(arg[0].val)) { // check if we are at the same node or note
                // debug ("SAME NODE")
                raiseCurrentThreadPC(lub(arg[0].lev, arg[1].lev));
                assertIsFunction(arg[1]);
                spawnLocal(arg[1].val);
            }
            else {
                assertIsNode(arg[0]);
                assertIsFunction(arg[1]);
                return spawnAtNode(arg[0], arg[1]);
            }
        }
        else {
            assertIsFunction(larg);
            spawnLocal(arg);
        }
    }, "spawn");
    rt_save = mkBase(function (env, larg) {
        assertIsNTuple(larg, 2);
        raiseCurrentThreadPC(larg.lev);
        var arg = larg.val;
        var file = arg[0].val;
        var data = arg[1];
        persist(data, "./out/saved." + file + ".json");
        rt_ret(__unit);
    }, "save");
    rt_restore = mkBase(function (env, arg) {
        assertIsString(arg);
        var theThread = __sched.__currentThread;
        var file = arg;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var jsonStr, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readFile("./out/saved." + file.val + ".json")];
                    case 1:
                        jsonStr = _a.sent();
                        return [4 /*yield*/, serialize_js_1.default.deserializeAsync(levels.TOP, JSON.parse(jsonStr))];
                    case 2:
                        data = _a.sent();
                        theThread.returnInThread(data);
                        __sched.scheduleThreadT(theThread);
                        __sched.resumeLoopAsync();
                        return [2 /*return*/];
                }
            });
        }); })();
    }, "restore");
    rt_send = mkBase(function (env, larg) {
        raiseCurrentThreadPCToBlockingLev();
        assertNormalState("send");
        raiseCurrentThreadPC(larg.lev);
        assertIsNTuple(larg, 2);
        assertIsProcessId(larg.val[0]);
        var arg = larg.val;
        // we need to check whether the recipient process is local
        // if yes, then we just proceed by adding the message to the
        // local mailbox; otherwise we need to proceed to serialization
        // external call.
        var lRecipientPid = arg[0];
        // debug ("* rt rt_send *", lRecipientPid);
        raiseCurrentThreadPC(lRecipientPid.lev); // this feels a bit odd.
        var message = arg[1];
        rt_sendMessageNochecks(lRecipientPid, message);
    }, "send");
    rt_receive = mkBase(baseRcv);
    rt_rcvp = mkBase(receiveAtOneLevel);
    rt_rcv = mkBase(receiveBoundedRangeWithAuthority);
    rt_exit = mkBase(function (env, arg) {
        assertNormalState("exit");
        assertIsNTuple(arg, 2);
        assertIsAuthority(arg.val[0]);
        assertIsNumber(arg.val[1]);
        assertIsTopAuthority(arg.val[0]);
        cleanup();
        //process.exit(arg.val[1].val);
    }, "exit");
    rt_getTime = mkBase(function (env, arg) {
        assertIsUnit(arg);
        var d = new Date();
        var t = d.getTime();
        var v = new Lval_js_1.LVal(t, __sched.pc);
        rt_ret(v);
    });
    rt_printWithLabels = mkBase(function (env, arg) {
        log(__sched.__currentThread.mkCopy(arg).stringRep(false));
        rt_ret(__unit);
    }, "printWithLabels");
    rt_toString = mkBase(function (env, arg) {
        var taintRef = { lev: __sched.pc };
        var s = __sched.__currentThread.mkCopy(arg).stringRep(true, // omit labels
        taintRef // accumulate taint into this reference
        );
        var r = __sched.__currentThread.mkValWithLev(s, taintRef.lev);
        rt_ret(r);
    }, "toString");
    rt_toStringLabeled = mkBase(function (env, arg) {
        var v = __sched.__currentThread.mkCopy(arg);
        var taintRef = { lev: __sched.pc };
        var s = v.stringRep(false, // do not omit labels 
        taintRef // accumulate taint into this reference
        );
        var r = __sched.__currentThread.mkValWithLev(s, taintRef.lev);
        rt_ret(r);
    }, "toStringLabeled");
    rt_print = mkBase(function (env, arg) {
        log(
        // colors.green (formatToN ( "PID:" +  __sched.currentThreadId.stringRep(), 30)),
        // colors.green (formatToN ( "PC:" +  __sched.pc.stringRep(), 20)),
        // colors.green (formatToN ( "BL:" +  __sched.blockingTopLev.stringRep(), 20)),
        arg.stringRep(true));
        rt_ret(__unit);
    }, "print");
    rt_printString = mkBase(function (env, arg) {
        assertIsString(arg);
        log(arg.val);
        rt_ret(__unit);
    }, "printString");
    rt_writeString = mkBase(function (env, arg) {
        assertIsString(arg);
        //todo: substitute below
        //process.stdout.write(arg.val)
        rt_ret(__unit);
    }, "writeString");
    rt_question = mkBase(function (env, arg) {
        //readline.removeListener ('line', lineListener);
        //term.removeListener ('line', lineListener);
        var theThread = __sched.__currentThread;
        assertIsString(arg);
        theThread.raiseBlockingThreadLev(levels.TOP);
        /*
        readline.question (arg.val, (s) => {
          let r = theThread.mkValWithLev (s, levels.TOP)
          theThread.returnInThread (r)
          __sched.scheduleThreadT(theThread);
          __sched.resumeLoopAsync()
      
          readline.on ('line', lineListener)
      
        })*/
    }, "question");
    rt_inputline = mkBase(function (env, arg) {
        assertIsUnit(arg);
        var theThread = __sched.__currentThread;
        theThread.raiseBlockingThreadLev(levels.TOP);
        if (lineBuffer.length > 0) {
            var s = lineBuffer.shift();
            var r = theThread.mkValWithLev(s, levels.TOP);
            rt_ret(r);
        }
        else {
            readlineCallbacks.push(function (s) {
                var r = theThread.mkValWithLev(s, levels.TOP);
                theThread.returnInThread(r);
                __sched.scheduleThreadT(theThread);
                __sched.resumeLoopAsync();
            });
        }
    }, "inputLine");
    rt_debug = function (s) {
        var tid = __sched.__currentThread.tid.stringRep();
        var pid = __sched.pc.stringRep();
        var bid = __sched.blockingTopLev.stringRep();
        log(colors.red(formatToN("PID:" + tid, 50)) + " " +
            colors.red(formatToN("PC:" + pid, 20)) + " " +
            colors.red(formatToN("BL:" + bid, 20)) + " " +
            s);
    };
    rt_attenuate = mkBase(function (env, arg) {
        assertIsNTuple(arg, 2);
        var argv = arg.val;
        var authFrom = argv[0];
        assertIsAuthority(authFrom);
        var levTo = argv[1];
        assertIsLevel(levTo);
        var ok_to_attenuate = flowsTo(levTo.val, authFrom.val.authorityLevel);
        // todo: 2018-10-18: AA; are we missing anything?
        var l_meta = lubs([__sched.pc, arg.lev, authFrom.lev, levTo.lev]);
        var l_auth = ok_to_attenuate ? levTo.val : levels.BOT;
        var r = new Lval_js_1.LVal(new Authority_js_1.Authority(l_auth), l_meta);
        rt_ret(r);
    }, "attenuate");
    rt_declassify = mkBase(function (env, arg) {
        //  assertDeclassificationAllowed()// 2019-03-06: AA: allowing declassification everywhere?
        assertIsNTuple(arg, 3);
        var argv = arg.val;
        var data = argv[0];
        var auth = argv[1];
        assertIsAuthority(auth);
        var toLevV = argv[2];
        assertIsLevel(toLevV);
        var pc = __sched.pc;
        var levFrom = data.lev;
        // check that levFrom ⊑ auth ⊔ levTo
        var _l = lubs([auth.val.authorityLevel, toLevV.val]);
        var ok_to_declassify = flowsTo(levFrom, _l);
        if (ok_to_declassify) {
            // we need to collect all the restrictions
            var r = new Lval_js_1.LVal(data.val, lubs([toLevV.val, toLevV.lev, pc, arg.lev, auth.lev]));
            rt_ret(r); // schedule the return value
        }
        else {
            var errorMessage = "Not enough authority for declassification\n" +
                (" | level of the data: " + data.lev.stringRep() + "\n") +
                (" | level of the authority: " + auth.val.authorityLevel.stringRep() + "\n") +
                (" | target level of the declassification: " + toLevV.val.stringRep());
            threadError(errorMessage);
            // return; // nothing scheduled; should be unreachabele
        }
    }, "declassify");
    rt_raiseTrust = mkBase(function (env, arg) {
        assertNormalState("raise trust");
        assertIsNTuple(arg, 3);
        var argv = arg.val;
        var data = argv[0];
        assertIsString(data);
        var authFrom = argv[1];
        assertIsAuthority(authFrom);
        assertIsTopAuthority(authFrom); // AA; 2019-03-07: may be a bit pessimistic, but okay for now
        var levTo = argv[2];
        assertIsLevel(levTo);
        var ok_to_raise = flowsTo(levTo.val, authFrom.val.authorityLevel);
        // AA, 2018-10-20 : beware that no information flow is enforced here
        // let l_meta = lubs ([__sched.pc, arg.lev, authFrom.lev, levTo.lev])
        var l_raise = ok_to_raise ? levTo.val : levels.BOT;
        var nodeId = data.val;
        var currentLevel = nodeTrustLevel(nodeId);
        _trustMap[nodeId] = lub(currentLevel, l_raise);
        rt_ret(__unit);
    }, "raiseTrust");
    /**
     * Returns a string corresponding to the node identify
     * from a process
     */
    rt_nodeFromProcess = mkBase(function (env, arg) {
        assertIsProcessId(arg);
        var data = arg.val;
        var nodeId = data.node.nodeId;
        var v = new Lval_js_1.LVal(nodeId, arg.lev);
        rt_ret(v);
    }, "node");
    // TODO: check that the arguments to the register are actually pids
    rt_register = mkBase(function (env, arg) {
        assertNormalState("register");
        assertIsNTuple(arg, 3);
        assertIsString(arg.val[0]);
        assertIsProcessId(arg.val[1]);
        assertIsAuthority(arg.val[2]);
        assertIsTopAuthority(arg.val[2]);
        // TODO: 2018-07-29: info flow checks
        // this is needed, because registration
        // is stateful
        var k = arg.val[0].val;
        var v = arg.val[1];
        __theRegister[k] = v;
        rt_ret(__unit);
    }, "register");
    rt_whereis = mkBase(function (env, arg) {
        assertNormalState("whereis");
        assertIsNTuple(arg, 2);
        assertIsNode(arg.val[0]);
        assertIsString(arg.val[1]);
        raiseCurrentBlockingThreadLev(arg.val[0].lev);
        raiseCurrentBlockingThreadLev(arg.val[1].lev);
        // let n = dealias(arg.val[0].val);    
        var n = __nodeManager.getNode(arg.val[0].val).nodeId;
        var k = arg.val[1].val;
        var nodeLev = nodeTrustLevel(n);
        var theThread = __sched.__currentThread;
        var okToLookup = flowsTo(lubs([__sched.pc, arg.val[0].lev, arg.val[1].lev]), nodeLev);
        if (!okToLookup) {
            threadError("Information flow violation in whereis");
            return;
        }
        if (__nodeManager.isLocalNode(n)) {
            if (__theRegister[k]) {
                rt_ret(theThread.mkVal(__theRegister[k]));
            }
        }
        else {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var body1, body, pid, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, localNode.whereisp2p(n, k)];
                        case 1:
                            body1 = _a.sent();
                            return [4 /*yield*/, serialize_js_1.default.deserializeAsync(nodeTrustLevel(n), body1)];
                        case 2:
                            body = _a.sent();
                            pid = new ProcessID(body.val.uuid, body.val.pid, body.val.node);
                            theThread.returnInThread(theThread.mkValWithLev(pid, body.lev));
                            __sched.scheduleThreadT(theThread);
                            __sched.resumeLoopAsync();
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            debug("whereis error: " + err_2.toString());
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, "whereis");
    // is it always taken a LVal as input?
    rt_ret = function (arg) { return __sched.returnInThread(arg); };
    rt_localStorageWrite = mkBase(function (env, arg) {
        //console.log("Writing", arg.val[0].val, "to localstorage");
        assertIsNTuple(arg, 2);
        assertIsString(arg.val[0]);
        assertIsString(arg.val[1]); // read only returns strings, so it is best to also write them
        // Should also make a check of the second argument
        localStorage.setItem(arg.val[0].val, arg.val[1].stringRep());
        //log('localStorage');
        rt_ret(__unit);
    }, "localStorageWrite");
    rt_localStorageRead = mkBase(function (env, arg) {
        //console.log("Reading", arg.val, "in localStorage");
        assertIsString(arg);
        var data = localStorage.getItem(arg.val);
        var dataSplit = data.split("@");
        var val = rtObj.mkValPos(dataSplit[0].replace('"', ''), '');
        var lev = dataSplit[1].split("%")[0].replace('{', '').replace('}', '');
        var label = rtObj.mkLabel(lev);
        rt_ret(rtObj.raisedTo(val, label));
    }, "rt_localStorageRead");
    rt_localStorageDelete = mkBase(function (env, arg) {
        //console.log("Deleting", arg.val, "in localStorage");
        assertIsString(arg);
        localStorage.removeItem(arg.val);
        rt_ret(__unit);
    }, "rt_localStorageDelete");
}
initRuntime();
function okToDeclassify(levFrom, levTo, auth) {
    var _l = lubs([auth.val.authorityLevel, levTo.val]);
    return flowsTo(levFrom.lev, _l);
}
/** Receiving functionality; 2020-02-03; AA
 *
 * Observe that we have three receive functions.
 *
 * 1. The most general one is called `rcv` and it takes a 4-tuple of the form
 *    (low_bound_lev, high_bound_lev, authority, handlers), and performs an
 *    interval receive on all messages from the lower to the higher bound.
 *    Because this sort of ranged modifies the state of the mailbox in a way
 *    that leaks information, it is necessary to also include an authority
 *    argument here. The implementation of this function checks that the
 *    provided authority is sufficient; this check is perfomed similaly to how
 *    declassification checks are performed.
 *
 * 2. Receive on a point interval, `rcvp`. In this case, no authority is
 *    required.
 *
 * 3. Receive on a point consisting of the current program counter, `receive`.
 *    We include this option only for backward compatibility with many earlier
 *    examples.
 *
 *
 */
// this function must only be called from 
// one of the checked functions 
function _receiveFromMailbox(lowb, highb, handlers) {
    raiseCurrentThreadPC(lub(lowb.lev, highb.lev));
    __theMailbox.rcv(lub(lowb.val, __sched.pc), highb.val, handlers);
}
function receiveBoundedRangeWithAuthority(env, arg) {
    assertNormalState("receive");
    assertIsNTuple(arg, 4);
    assertIsLevel(arg.val[0]);
    assertIsLevel(arg.val[1]);
    assertIsAuthority(arg.val[2]);
    assertIsList(arg.val[3]);
    var lowb = arg.val[0];
    var highb = arg.val[1];
    var auth = arg.val[2];
    var handlers = arg.val[3];
    var is_sufficient_authority = okToDeclassify(highb, lowb, auth);
    if (is_sufficient_authority) {
        _receiveFromMailbox(lowb, highb, handlers);
    }
    else {
        var errorMessage = "Not enough authority for ranged receive\n" +
            (" | lower bound: " + lowb.stringRep() + "\n") +
            " | upper bound: need to fix this" + //${highb.val.stringRep()}`
            (" | authority:  " + auth.val.authorityLevel.stringRep() + "\n");
        threadError(errorMessage);
    }
}
function receiveAtOneLevel(env, arg) {
    assertNormalState("receive");
    assertIsNTuple(arg, 2);
    assertIsLevel(arg.val[0]);
    assertIsList(arg.val[1]);
    var lev = arg.val[0];
    var handlers = arg.val[1];
    _receiveFromMailbox(lev, lev, handlers);
}
function baseRcv(env, handlers) {
    assertNormalState("receive");
    assertIsList(handlers);
    __theMailbox.rcv(__sched.pc, __sched.pc, handlers);
}
function formatToN(s, n) {
    if (s.length < n) {
        var j = s.length;
        for (; j < n; j++) {
            s = s + " ";
        }
    }
    return s;
}
function whereisFromRemote(k) {
    return __awaiter(this, void 0, void 0, function () {
        var serObj;
        return __generator(this, function (_a) {
            __sched.resumeLoopAsync();
            // TODO: 2018-10-20: make use of the levels as they were
            // recorded during the registration (instead of the bottom here )
            if (__theRegister[k]) {
                serObj = serialize_js_1.default.serialize(__theRegister[k], levels.BOT).data;
                return [2 /*return*/, serObj];
            }
            return [2 /*return*/];
        });
    });
}
var baseMkSecret = function (env, x) {
    // debug ("making secret " + x.val)
    rt_ret(new Lval_js_1.LVal(x.val, levels.TOP));
};
var baseDisclose = function (env, x) {
    assertNormalState("baseDisclose");
    // assert that
    // pc ⊔ x.lev ⊑ LOW
    if (!flowsTo(lub(__sched.joinedLev, x.lev), levels.BOT)) {
        threadError("Illegal flow in adv function:\n" +
            (" |    pc: " + __sched.pc.stringRep() + "\n") +
            (" | block: " + __sched.blockingTopLev.stringRep() + "\n") +
            (" | value: " + x.stringRep()));
    }
    rt_ret(__unit);
};
// --------------------------------------------------
function rt_setret(namespace, kf, e) {
    // assertIsEnv(e);
    var r = new RtClosure_js_1.RtClosure(e, namespace, kf);
    //__sched.setret(r); //todo - tc: this method is not declared in Scheduler
}
function rt_mkLabel(x) {
    // debug ("mkLabel", x, x === "secret");
    return new Lval_js_1.LVal(levels.mkLevel(x), __sched.pc);
}
function listStringRep(x, omitLevels, taintRef) {
    if (omitLevels === void 0) { omitLevels = false; }
    if (taintRef === void 0) { taintRef = null; }
    if (x.length == 0) {
        return "";
    }
    var s = x[0].stringRep(omitLevels, taintRef);
    for (var i = 1; i < x.length; i++) {
        s += ", " + x[i].stringRep(omitLevels, taintRef);
    }
    return s;
}
function rt_mkTuple(x) {
    x.stringRep = function (omitLevels, taintRef) {
        if (omitLevels === void 0) { omitLevels = false; }
        if (taintRef === void 0) { taintRef = null; }
        return ("(" + listStringRep(x, omitLevels, taintRef) + ")");
    };
    x.isTuple = true;
    return x;
}
function rt_mkList(x) {
    x.stringRep = function (omitLevels, taintRef) {
        if (omitLevels === void 0) { omitLevels = false; }
        if (taintRef === void 0) { taintRef = null; }
        return ("[" + listStringRep(x, omitLevels, taintRef) + "]");
    };
    x.isList = true;
    return x;
}
function threadError(s, internal) {
    if (internal === void 0) { internal = false; }
    return __sched.__currentThread.threadError(s, internal);
}
function rt_error(x) {
    threadError(x.val);
}
function rt_errorPos(x, pos) {
    if (pos != '') {
        threadError(x.val + " at " + pos);
    }
    else {
        threadError(x.val);
    }
}
function rt_tailcall(lff, arg) {
    assertIsFunction(lff);
    if (!lff.val.fun) {
        log("UNDEF FUN");
    }
    raiseCurrentThreadPC(lff.lev);
    var ff = lff.val;
    //__sched.tailNext ( () => {  ff.fun.apply (ff.namespace, [ff.env, arg]) } );
    // __sched.tailNext ( () => { ff.fun (ff.env, arg) } );
    __sched.tail(ff.fun, ff.env, arg, ff.namespace);
}
function runtimeEquals(o1, o2) {
    if (typeof o1.atom != "undefined" && typeof o2.atom != "undefined") {
        // obs: atoms operate in a global namespace; 2018-03-09; aa
        return (o1.atom == o2.atom);
    }
    if (typeof o1.pid != "undefined" &&
        typeof o2.pid != "undefined") {
        return (process_js_1.default.pid_val_equals(o1, o2));
    }
    else {
        return (o1 == o2);
    }
}
function rt_loadLib(lib, decl, obj) {
    // load the lib from the linked data structure
    var r = obj.libs[lib + "." + decl];
    var rv = rt_mkVal(r);
    // rt_debug("loading lib " + decl);
    return rv;
}
function rt_linkLibs(libs, obj, cb) {
    obj.libs = {};
    loadLibs_js_1.default.loadLibsAsync(libs, obj, cb, rtObj);
}
function nodeTrustLevel(nodeid) {
    if (_trustMap) {
        return _trustMap[nodeid] ? _trustMap[nodeid] : levels.BOT;
    }
    return levels.BOT;
}
// 2018-12-07: adding some code for enforcing semantics of numbers
// 
function assertIsBoolean(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (typeof x.val != 'boolean') {
        threadError("value " + x.stringRep() + " is not a boolean");
    }
}
function assertIsNumber(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (typeof x.val != 'number') {
        threadError("value " + x.stringRep() + " is not a number");
    }
}
function assertIsFunction(x, internal) {
    if (internal === void 0) { internal = false; }
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!((x.val instanceof RtClosure_js_1.RtClosure) || (x.val instanceof BaseFunction_js_1.BaseFunction))) {
        threadError("value " + x.stringRep() + " is not a function", internal);
    }
}
function assertIsHandler(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(x.val instanceof RtClosure_js_1.RtClosure)) { // 2018-12-10: AA: in the future we may need to change this to special handler class
        threadError("value " + x.stringRep() + " is not a handler");
    }
}
function assertIsUnit(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (x.val != UnitBase_js_1.theBaseUnit) {
        threadError("value " + x.stringRep() + " is not unit");
    }
}
function assertIsListOrTuple(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(Array.isArray(x.val) && (ValuesUtil_js_1.isListFlagSet(x.val) || ValuesUtil_js_1.isTupleFlagSet(x.val)))) {
        threadError("value " + x.stringRep() + " is not a list");
    }
}
function assertIsList(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(Array.isArray(x.val) && ValuesUtil_js_1.isListFlagSet(x.val))) {
        threadError("value " + x.stringRep() + " is not a list");
    }
}
function assertIsNTuple(x, n) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(Array.isArray(x.val) && ValuesUtil_js_1.isTupleFlagSet(x.val) && x.val.length == n)) {
        threadError("value " + x.stringRep() + " is not a " + n + "-tuple");
    }
}
function assertIsString(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (typeof x.val != 'string') {
        threadError("value " + x.stringRep() + " is not a string");
    }
}
function assertIsNode(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (typeof x.val != 'string') {
        threadError("value " + x.stringRep() + " is not a node string"); // todo: check for it being a proper nodeid format?
    }
}
function assertIsProcessId(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(x.val instanceof ProcessID)) {
        threadError("value " + x.stringRep() + " is not a process id");
    }
}
function assertIsLevel(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(x.val instanceof Level_js_1.Level)) {
        threadError("value " + x.stringRep() + " is not a level");
    }
}
function assertIsTopAuthority(x) {
    var isTop = flowsTo(levels.TOP, x.val.authorityLevel);
    if (!isTop) {
        var errorMessage = "Provided authority is not TOP\n" +
            (" | level of the provided authority: " + x.val.authorityLevel.stringRep());
        threadError(errorMessage);
    }
}
function assertIsAuthority(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(x.val instanceof Authority_js_1.Authority)) {
        threadError("value " + x.stringRep() + " is not a authority");
    }
}
function assertIsEnv(x) {
    raiseCurrentBlockingThreadLev(x.tlev);
    if (!(x.val instanceof RtEnv)) {
        threadError("value " + x.stringRep() + " is not an environment");
    }
}
function assertNormalState(s) {
    if (!__sched.handlerState.isNormal()) {
        threadError("invalid handler state in " + s + " -- side effects are prohbited in handler pattern matching or sandboxed code");
    }
}
function assertDeclassificationAllowed(s) {
    if (!__sched.handlerState.declassificationAllowed()) {
        threadError("invalid handler state in " + s + ": declassification prohibited in handler pattern matching");
    }
}
function assertPairAreNumbers(x, y) {
    assertIsNumber(x);
    assertIsNumber(y);
}
function assertPairAreStringsOrNumbers(x, y) {
    raiseCurrentBlockingThreadLev(x.tlev);
    switch (typeof x.val) {
        case 'number':
            assertIsNumber(y);
            break;
        case 'string':
            assertIsString(y);
            break;
        default: threadError("values " + x.stringRep() + " and " + y.stringRep() + " are of different types");
    }
}
function RuntimeObject() {
    var _this = this;
    this.Atom = function (name, creation_uuid) {
        if (creation_uuid === void 0) { creation_uuid = rt_uuid; }
        var atm = {
            atom: name,
            creation_uuid: creation_uuid,
            stringRep: function (omitLevels) {
                if (omitLevels === void 0) { omitLevels = false; }
                return name;
            }
        };
        return atm;
    };
    this.assertIsHandler = assertIsHandler;
    this.assertIsNTuple = assertIsNTuple;
    this.assertIsFunction = assertIsFunction;
    this.Authority = Authority_js_1.Authority;
    this.ProcessID = ProcessID;
    this.LVal = Lval_js_1.LVal;
    this.lub = lub;
    this.glb = glb;
    this.error = rt_error;
    this.errorPos = rt_errorPos;
    this.threadError = threadError;
    this.Closure = RtClosure_js_1.RtClosure;
    this.Env = RtEnv;
    this.setret = rt_setret;
    // this.resetret = rt_resetret
    this.ret = rt_ret;
    this.__unitbase = UnitBase_js_1.theBaseUnit;
    this.__unit = __unit;
    this.rt_uuid = __sched.rt_uuid;
    this.tailcall = rt_tailcall;
    this.mkVal = rt_mkVal;
    this.mkValPos = rt_mkValPos;
    this.mkCopy = rt_mkCopy;
    this.mkTuple = rt_mkTuple;
    this.mkList = rt_mkList;
    this.loadLib = rt_loadLib;
    this.debug = rt_debug;
    this.linkLibs = rt_linkLibs;
    this.levels = levels;
    this.persist = persist;
    this.mkLabel = rt_mkLabel;
    this.raisedTo = function (x, y) {
        return new Lval_js_1.LVal(x.val, lub(lub(x.lev, y.val), y.lev), lubs([x.tlev, y.tlev, __sched.pc]));
    };
    // this.flowsTo = function (x, y) {
    //   return new LVal(flowsTo(x.val, y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
    // }
    /*
    this.levelOf = function (x) {
      return new LVal(x.lev, lub (pc, x.lev)); // 2018-10-15: AA; implementing a sticky level
    }
    */
    this.unaryMinus = function (x) {
        assertIsNumber(x);
        return new Lval_js_1.LVal(-x.val, x.lev, x.tlev);
    };
    this.node = rt_nodeFromProcess;
    this.raiseTrust = rt_raiseTrust;
    this.attenuate = rt_attenuate;
    this.declassify = rt_declassify;
    this.toStringL = rt_toStringLabeled;
    this.toString = rt_toString;
    this.getTime = rt_getTime;
    this.print = rt_print;
    this.printWithLabels = rt_printWithLabels;
    this.printString = rt_printString;
    this.writeString = rt_writeString;
    this.inputLine = rt_inputline;
    this.question = rt_question;
    this.self = rt_self;
    this.send = rt_send;
    this.spawn = rt_spawn;
    this.sleep = rt_sleep;
    this.sandbox = rt_sandbox;
    this.restore = rt_restore;
    this.save = rt_save;
    this.receive = rt_receive;
    this.rcvp = rt_rcvp;
    this.rcv = rt_rcv;
    this.mkSecret = mkBase(baseMkSecret);
    this.adv = mkBase(baseDisclose);
    this.register = rt_register;
    this.whereis = rt_whereis;
    this.exit = rt_exit;
    this.localStorageWrite = rt_localStorageWrite;
    this.localStorageRead = rt_localStorageRead;
    this.localStorageDelete = rt_localStorageDelete;
    this.debugpc = mkBase(function (env, arg) {
        //    assertIsString(arg);
        rt_debug("");
        rt_ret(__unit);
    });
    this.eq = function (x, y) {
        return new Lval_js_1.LVal(runtimeEquals(x.val, y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.neq = function (x, y) {
        return new Lval_js_1.LVal(!(runtimeEquals(x.val, y.val)), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.stringConcat = function (x, y) {
        assertIsString(x);
        assertIsString(y);
        return new Lval_js_1.LVal((x.val + y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.plus = function (x, y) {
        //    assertPairAreNumbers(x,y);
        assertPairAreStringsOrNumbers(x, y);
        return new Lval_js_1.LVal((x.val + y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.minus = function (x, y) {
        assertPairAreNumbers(x, y);
        var rv = new Lval_js_1.LVal((x.val - y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
        return rv;
    };
    this.mult = function (x, y) {
        assertPairAreNumbers(x, y);
        return new Lval_js_1.LVal((x.val * y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.div = function (x, y) {
        assertPairAreNumbers(x, y);
        return new Lval_js_1.LVal((x.val / y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.le = function (x, y) {
        assertPairAreStringsOrNumbers(x, y);
        return new Lval_js_1.LVal((x.val <= y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.lt = function (x, y) {
        assertPairAreStringsOrNumbers(x, y);
        return new Lval_js_1.LVal((x.val < y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.ge = function (x, y) {
        assertPairAreStringsOrNumbers(x, y);
        return new Lval_js_1.LVal((x.val >= y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.gt = function (x, y) {
        assertPairAreStringsOrNumbers(x, y);
        return new Lval_js_1.LVal((x.val > y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.and = function (x, y) {
        assertIsBoolean(x);
        assertIsBoolean(y);
        return new Lval_js_1.LVal((x.val && y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.or = function (x, y) {
        assertIsBoolean(x);
        assertIsBoolean(y);
        return new Lval_js_1.LVal((x.val || y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
    };
    this.index = function (x, y) {
        assertIsListOrTuple(x);
        assertIsNumber(y);
        var z = x.val[y.val];
        return new Lval_js_1.LVal(z.val, lub(lub(x.lev, y.lev), z.lev), lubs([x.tlev, y.tlev, z.tlev]));
    };
    this.islist = function (x) {
        return new Lval_js_1.LVal(Array.isArray(x.val) && ValuesUtil_js_1.isListFlagSet(x.val), x.lev, x.tlev);
    };
    this.istuple = function (x) {
        return new Lval_js_1.LVal(Array.isArray(x.val) && ValuesUtil_js_1.isTupleFlagSet(x.val), x.lev, x.tlev);
    };
    this.cons = function (a, b) {
        assertIsList(b); // 2019-03-07: AA; consider forcing the elements of the list to be of the same type (unless nil)
        var x = b.val.slice();
        x.unshift(a);
        return new Lval_js_1.LVal(rt_mkList(x), b.lev, b.tlev);
    };
    this.length = function (x) {
        assertIsListOrTuple(x);
        return new Lval_js_1.LVal(x.val.length, x.lev, x.tlev);
    };
    this.head = function (x) {
        assertIsList(x);
        var y = x.val[0];
        return new Lval_js_1.LVal(y.val, lub(y.lev, x.lev), x.tlev);
    };
    this.tail = function (x) {
        assertIsList(x);
        var y = x.val.slice(1);
        return new Lval_js_1.LVal(rt_mkList(y), x.lev, x.tlev);
    };
    this.getVal = function (x) {
        return x.val;
    };
    this.branch = function (x) {
        raiseCurrentThreadPC(x.lev);
    };
    this.push = function (x) {
        __sched.__currentThread.callInThread(x);
    };
    this.assertOrError = function (x) {
        raiseCurrentBlockingThreadLev(x.lev);
    };
    this.levelOf = mkBase(function (env, arg) {
        var l = arg.lev;
        rt_ret(new Lval_js_1.LVal(l, lub(__sched.pc, l)));
    });
    this.flowsTo = mkBase(function (env, arg) {
        assertIsNTuple(arg, 2);
        var x = arg.val[0];
        var y = arg.val[1];
        assertIsLevel(x);
        assertIsLevel(y);
        rt_ret(new Lval_js_1.LVal(flowsTo(x.val, y.val), lub(__sched.pc, lub(x.lev, y.lev))));
    });
    this.pcpush = mkBase(function (env, arg) {
        assertNormalState("pcpush");
        var cap = rt_mkuuid();
        __sched.__currentThread.pcpush(arg, cap);
        rt_ret(cap);
    });
    this.pcpop = mkBase(function (env, arg) {
        assertNormalState("pcpop");
        assertIsString(arg);
        __sched.__currentThread.pcpop(arg);
    });
    this.pinipush = mkBase(function (env, arg) {
        assertNormalState("pinipush");
        assertIsAuthority(arg);
        var cap = rt_mkuuid();
        __sched.__currentThread.pinipush(arg, cap);
        rt_ret(cap);
    });
    this.pinipop = mkBase(function (env, arg) {
        assertNormalState("pinipop");
        assertIsString(arg);
        __sched.pinipop(arg);
    });
    /* Implementation note: 2019-01-02; AA: exit capabilities are implemented as
     * records of two functions (see MailboxProcessor.js) -- one for when the
     * handler pattern is successful, and one for when it is not. All we do in the
     * corresponding runtime functions is dynamically check the types, raise the
     * pc levels depending on the arguments, and then just call the corresponding
     * functions. The functions themselves are defined in MailboxProcessor.js.
     */
    this.setLibloadMode = function () {
        _this.mkVal = function (x) { return new Lval_js_1.LVal(x, levels.BOT); };
        _this.mkValPos = function (x, pos) { return new Lval_js_1.LVal(x, levels.BOT, levels.BOT, pos); };
        _this.Env = LibEnv;
    };
    this.setNormalMode = function () {
        _this.mkVal = rt_mkVal;
        _this.Env = RtEnv;
    };
    this.mkuuid = mkBase(function (env, arg) {
        assertIsUnit(arg);
        rt_ret(rt_mkuuid());
    });
    this.newlabel = mkBase(function (env, arg) {
        assertIsUnit(arg);
        var levid = uuidv4().toString();
        rt_ret(rt_mkLabel(levid));
    });
    this.sendMessageNoChecks = rt_sendMessageNochecks;
    this.monitorlocal = mkBase(function (env, arg) {
        assertNormalState("monitor");
        raiseCurrentThreadPC(arg.lev);
        assertIsProcessId(arg);
        var tid = arg.val;
        // 1. find the thread corresponding to that tid 
        var t = __sched.__alive[tid.toString()];
        // 2. update the monitor state of that thread
        var r = rt_mkuuid();
        if (t) {
            t.addMonitor(__sched.currentThreadId, r);
        }
        rt_ret(r);
    });
    this.demonitorlocal = mkBase(function (env, arg) {
        assertIsString(arg);
        // mutates state; so we should be careful...
        rt_ret(__unit);
    });
}
function mkRuntime() {
    //todo: set check bool for if mkRuntime has been run - isRuntimeCreated
    rtObj = new RuntimeObject();
    debug("Initialized RuntimeObject i.e. rtObj");
    __theMailbox.setRuntimeObject(rtObj);
    debug("Setting rtObj as rt in __theMailbox");
    __sched.setRuntimeObject(rtObj);
    debug("Setting rtObj as rt in __sched");
    return rtObj;
}
exports.mkRuntime = mkRuntime;
function cleanup(cb) {
    if (cb === void 0) { cb = function () { }; }
    debug("cleanup called");
    //term.close();
    // todo-api: localhost/../serialize                    
    serialize_js_1.default.stopCompiler();
    if (__p2pRunning) {
        localNode.stopp2p(function (err) {
            debug("stopping p2p ");
            if (err) {
                debug("p2p stop failed ", err);
            }
            else {
                debug("p2p stop OK");
            }
            cb();
        });
    }
}
//todo: make a sigint cleanup for xterm
/*
process.on('SIGINT', () => {
  debug("SIGINT")
  cleanup(() => {
    //todo: substitute
    //process.exit(0);
  });
})
*/
function startRuntime(file) {
    return __awaiter(this, void 0, void 0, function () {
        // p is either null or peerInfo.id.toB58String() (i.e. id string for localnode)
        function networkReady(p) {
            if (p) {
                debug("network ready");
            }
            else {
                debug("network not initialized");
            }
            var hostname = p;
            __nodeManager.setLocalHostPort(hostname);
            // first thing we do is link libraries
            // once that is done; the linker function
            // will call back to our starting function
            //
            file.loadlibs(function () {
                debug("Declaring cb for loadlibs of file STARTED");
                // debug ("callback ok");
                // obs; 2018-03-10;aa: the order of these
                // initializations is important.
                //
                var stopWhenAllThreadsAreDone = p == null ? true : false;
                __sched.initScheduler(__nodeManager.getLocalNode(), stopWhenAllThreadsAreDone, cleanup);
                var mainAuthority = new Lval_js_1.LVal(new Authority_js_1.Authority(levels.TOP), levels.BOT);
                debug("Created mainAuthority");
                // Creating a new process and thread and put the thread inside the funloop of the schedulor
                debug("scheduleNewThreadAtLevel: thefun=main args=[null, mainAuthority] nm=file levpc=BOT levblock=BOT ismain=true, persist=null");
                __sched.scheduleNewThreadAtLevel(file.main, [null, mainAuthority], // Arguments to main - env=null, authorityarg=mainAuthority
                file, levels.BOT, levels.BOT, true, persist);
                // This is the execution part (takes Threads out of the funloop and executes them)
                __sched.loop();
                debug("Declaring cb for loadlibs of file ENDED");
            });
        }
        var persist, rtHandlers, trustMapFile, s, trustList, trustMap_1, allowRemoteSpawn, localonly, nodeIdFile, nodeIdObj;
        return __generator(this, function (_a) {
            //todo: abort with a message if isRuntimeCreated is false
            // todo-api: localhost/../serialize
            serialize_js_1.default.setRuntimeObj(rtObj);
            persist = null // yargs.argv.persist ? yargs.argv.persist : null;
            ;
            rtHandlers = {
                remoteSpawnOK: remoteSpawnOK,
                spawnFromRemote: spawnFromRemote,
                receiveFromRemote: receiveFromRemote,
                networkReady: networkReady,
                whereisFromRemote: whereisFromRemote
            };
            trustMapFile = "./trustmap.json" //yargs.argv.trustmap ? yargs.argv.trustmap : "trustmap.json";
            ;
            try {
                s = fs.readFileSync("./trustmap.json");
                trustList = JSON.parse(s);
                trustMap_1 = {};
                trustList.map(function (x) { return trustMap_1[x.id] = levels.mkLevel(x.level); });
                _trustMap = trustMap_1;
            }
            catch (err) {
                error("cannot load trust map file: " + err);
            }
            allowRemoteSpawn = null //yargs.argv.rspawn ? yargs.argv.rspawn : null
            ;
            if (allowRemoteSpawn) {
                if (allowRemoteSpawn == "true") {
                    _allowRemoteSpawn = true;
                }
            }
            localonly = true // yargs.argv.localonly ? yargs.argv.localonly : false;
            ;
            if (!localonly && !persist) {
                __p2pRunning = true;
            }
            nodeIdFile = null //yargs.argv.id ? yargs.argv.id : null;
            ;
            // START!
            if (nodeIdFile) {
                try {
                    nodeIdObj = fs.readFileSync(nodeIdFile);
                    localNode = p2p_js_1.startp2p(JSON.parse(nodeIdObj), rtHandlers);
                }
                catch (err) {
                    error("cannot load id file");
                    //process.exit(1);
                }
            }
            else {
                try {
                    console.log("localPersist:", localonly, persist);
                    if (localonly || persist) {
                        info("Skipping network creation. Observe that all external IO operations will yield a runtime error.");
                        if (persist) {
                            info("Running with persist flag.");
                        }
                        networkReady(null); // OBS: 2018-07-22: we are jumping over the network creation
                    }
                    else {
                        localNode = p2p_js_1.startp2p(null, rtHandlers);
                    }
                }
                catch (err) {
                    error("uncaught exception in the runtime");
                    error(err.stack);
                    ;
                    //process.exit(1);      
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.startRuntime = startRuntime;
