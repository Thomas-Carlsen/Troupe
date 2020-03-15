'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lval_js_1 = require("./Lval.js");
var SandboxStatus_js_1 = require("./SandboxStatus.js");
var options_js_1 = __importDefault(require("./options.js"));
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger('mbox');
var debug = function (x) { return logger.debug(x); };
function Message(msg, fromNodeId, pc) {
    var tuple = [msg, fromNodeId];
    tuple["isTuple"] = true; // hack! 2018-10-19: AA
    return new Lval_js_1.LVal(tuple, pc);
}
var MailboxProcessor = /** @class */ (function () {
    function MailboxProcessor(sched) {
        this.sched = sched;
        this.levels = options_js_1.default;
        this.mailboxes = new Array();
    }
    MailboxProcessor.prototype.setRuntimeObject = function (rtObj) {
        this.rtObj = rtObj;
    };
    MailboxProcessor.prototype.addMessage = function (fromNodeId, toPid, message, pc) {
        var __sched = this.sched;
        // check whether the recipient is alive
        if (!__sched.isAlive(toPid)) {
            return;
        }
        // get the recipient thread
        var t = __sched.getThread(toPid);
        // create the message 
        var messageWithSenderId = Message(message, fromNodeId, pc);
        // add the message to the thread's mailbox
        t.addMessage(messageWithSenderId);
        // unblock the thread if necessary        
        __sched.unblockThread(toPid);
    };
    MailboxProcessor.prototype.sweepMessages = function (messages, handlers, lowb, highb) {
        var lub = this.levels.lub;
        var flowsTo = this.levels.flowsTo;
        var __sched = this.sched;
        var __rtObj = this.rtObj;
        var mkBase = function (f) { return __sched.mkBase(f); };
        var raisePC = function (l) { __sched.raiseCurrentThreadPC(l); };
        var assertIsHandler = this.rtObj.assertIsHandler;
        var theThread = __sched.__currentThread;
        function iterate(handlerToUse, messageToCheck) {
            function futureMessage() {
                debug("unblocking");
                iterate(0, messageToCheck);
            }
            debug("* checkMessages  " + handlerToUse + " " + messageToCheck + " " + messages.length);
            if (handlerToUse < handlers.length && messageToCheck < messages.length) {
                debug("### 1");
                // debug.log (messages[messageToCheck]);
                var nextIter_1 = (handlerToUse == handlers.length - 1) ?
                    function () {
                        iterate(0, messageToCheck + 1);
                    } :
                    function () {
                        iterate(handlerToUse + 1, messageToCheck);
                    };
                // we need two arguments because this function is later used
                // in patFail which is called from the userland, and therefore
                // must adhere to our (env, arg) compliation convention.
                var senderPC_1 = messages[messageToCheck].lev;
                var msglvl = lub(senderPC_1, messages[messageToCheck].val[0].lev); // 2018-05-18!AA
                if (!(flowsTo(lowb, msglvl)) || !(flowsTo(msglvl, highb))) {
                    //debug.log("* checkMessages - skipping message because of rcv bounds");
                    __sched.schedule(nextIter_1, [null, null], null);
                    //
                }
                else {
                    var lh = handlers[handlerToUse];
                    assertIsHandler(lh);
                    // let threadState = theThread.exportState();
                    var guard = function (arg) {
                        // theThread.importState (threadState);
                        __rtObj.assertIsNTuple(arg, 2);
                        var status = arg.val[0];
                        theThread.raiseCurrentThreadPC(status.lev);
                        switch (status.val) {
                            case 0:
                                var funclos = arg.val[1];
                                __rtObj.assertIsFunction(funclos);
                                messages.splice(messageToCheck, 1);
                                theThread.raiseBlockingThreadLev(lub(senderPC_1, __sched.pc)); // 2018-11-29; AA, the lub is probably redundant...                        
                                theThread.handlerState = new SandboxStatus_js_1.HandlerState.NORMAL();
                                __rtObj.tailcall(funclos, __sched.__unit);
                                break;
                            default:
                                nextIter_1();
                                break;
                        }
                    };
                    theThread.callInThread(guard);
                    theThread.handlerState = new SandboxStatus_js_1.HandlerState.INHANDLER(mkBase(function (env, arg) {
                        __rtObj.ret(theThread.mkVal(__rtObj.mkTuple([theThread.mkVal(1), __sched.unit]))); // trigger next iter
                    }));
                    raisePC(lh.lev);
                    var h = lh.val;
                    var args = [h.env, messages[messageToCheck]];
                    // run the handler
                    __sched.schedule(h.fun, args, h.namespace);
                }
            }
            else {
                debug("### 2");
                __sched.__currentThread.block(futureMessage);
                // __sched.__currentThread.handlerState =  new HandlerState.INHANDLER(null);                
                __sched.blockThread(__sched.__currentThread);
            }
        }
        if (!__sched.handlerState.isNormal()) {
            __rtObj.threadError("invalid handler state in receive: side effects are prohbited in restricted state");
        }
        iterate(0, 0);
    };
    MailboxProcessor.prototype.rcv = function (lowb, highb, handlers) {
        var __sched = this.sched;
        var mb = __sched.__currentThread.mailbox;
        this.sweepMessages(mb, handlers.val, lowb, highb);
    };
    return MailboxProcessor;
}());
exports.MailboxProcessor = MailboxProcessor;
