// External module
const colors = require('./colors.js')
const uuidv4 = require('uuid/v4');
// have to substitute the below with xtermjs
const fs = require('fs');
//const yargs = require('yargs');
/*
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
*/
const { promisify } = require('util');



// Internal runtime modules
import { mkLogger } from './logger.js';
mkLogger("RTM").debug(`Importing internal modules`);
import { RtClosure } from './RtClosure.js';
mkLogger("RTM").debug(`Imported RtClosure.js`);
import { isListFlagSet, isTupleFlagSet } from './ValuesUtil.js';
mkLogger("RTM").debug(`Imported ValuesUtil.js`);
// an attempt to modularize the runtime; 2018-07-16; AA
//
import Scheduler from './Scheduler.js';
mkLogger("RTM").debug(`Imported Scheduler.js`);
import { LVal } from './Lval.js';
mkLogger("RTM").debug(`Imported Lval.js`);
import proc from './process.js';
mkLogger("RTM").debug(`Imported process.js`);
import { MailboxProcessor } from './MailboxProcessor.js';
mkLogger("RTM").debug(`Imported MailboxProcessor.js`);
import { NodeManager } from './NodeManager.js';
mkLogger("RTM").debug(`Imported NodeManager.js`);
import loadLibs from './loadLibs.js';
mkLogger("RTM").debug(`Imported loadLibs.js`);
import { BaseFunction } from './BaseFunction.js';
mkLogger("RTM").debug(`Imported BaseFunction.js`);
import { HandlerState as SandboxStatus } from './SandboxStatus.js';
mkLogger("RTM").debug(`Imported SandboxStatus.js`);
import { Authority } from './Authority.js';
mkLogger("RTM").debug(`Imported Authority.js`);
import options from './options.js';
mkLogger("RTM").debug(`Imported options.js`);
import { Level } from './Level.js';
mkLogger("RTM").debug(`Imported Level.js`);
import { theBaseUnit as __unitbase } from './UnitBase.js';
mkLogger("RTM").debug(`Imported UnitBase.js`);
import SS from './serialize.js';
mkLogger("RTM").debug(`Imported serialize.js`);
import {TagLevel} from './levels/tagsets.js';
import { startp2p } from './p2p/p2p.js';
mkLogger("RTM").debug(`Imported p2p.js`);

mkLogger("RTM").debug(`Imported modules in runtime`);

// GLOBALS
let __sched;
let __theMailbox;
let aliases;
let __nodeManager;
let localNode;
//const readFile = promisify (fs.readFile);
const rt_uuid = uuidv4();
//logs
let logLevel = 'debug' //yargs.argv.debug?'debug':'info';
const logger = mkLogger('RTM', logLevel);
const error = x => logger.error(x)
const info = x => logger.info(x)
const debug = (x, err?) => logger.debug(x)
const log = (mess) => logger.log(mess);
//todo: change this to termjs
const lineBuffer = [];
const readlineCallbacks = [];
const levels = options;
const lub = levels.lub;
const glb = levels.glb;
const flowsTo = levels.flowsTo;
let ProcessID = proc.ProcessID;
let _allowRemoteSpawn = false;
let __p2pRunning = false;
// these are initialized later in webServerReady handler
// once we get information from the webserver about the
// port on which we are listening...

let __theRegister = {}
let _trustMap = {}
let rtObj = null;

let mkBase;
let rt_ret;
let rt_mkVal;
let rt_mkValPos;
let rt_mkCopy;
let rt_debug;
let rt_nodeFromProcess;
let rt_raiseTrust;
let rt_attenuate;
let rt_declassify;
let rt_toStringLabeled;
let rt_toString;
let rt_getTime;
let rt_print;
let rt_printWithLabels;
let rt_printString;
let rt_writeString;
let rt_inputline;
let rt_question;
let rt_self;
let rt_send;
let rt_spawn;
let rt_sleep;
let rt_sandbox;
let rt_restore;
let rt_save;
let rt_receive;
let rt_rcvp;
let rt_rcv;
//   // this.mkSecret = mkBase(baseMkSecret);
//   // this.adv = mkBase(baseDisclose);
let rt_register;
let rt_whereis;
let rt_exit;
let __unit;

// My Features
let rt_localStorageWrite;
let rt_localStorageRead;
let rt_localStorageDelete;



let raiseCurrentThreadPC;
let raiseCurrentThreadPCToBlockingLev;
let raiseCurrentBlockingThreadLev;
let currentThreadPid;


debug(`Created GLOBALS`);


// CLASSES 
class RtEnv {
  constructor() {
    console.log("New rt Env");
    // this.ret = __sched.ret;
  }
}

class LibEnv {
  ret;
  constructor() {
    this.ret = null;
  }
}


debug(`Created CLASSES`);





// FUNCTIONS
function lineListener(input) {
  if (readlineCallbacks.length > 0) {
    let cb = readlineCallbacks.shift();
    cb(input);
  } else {
    lineBuffer.push(input);
  }
}

//readline.on ('line', lineListener)
//term.on('line', lineListener);



function lubs(x) {
  if (x.length == 0) {
    return levels.BOT;
  } else {
    let r = x[0];
    for (let i = 1; i < x.length; i++) {
      r = lub(r, x[i]);
    }
    return r;
  }
}
;







// --------------------------------------------------

async function spawnAtNode(nodeid, f) {
  console.log("spawnAtNode");
  // debug ("* rt spawnAtNode ", nodeid);
  let node = __nodeManager.getNode(nodeid.val);
  // debug ("XX", node);

  // TODO: 2018-09-24: AA: do the information flow check

  // todo-api: localhost/../serialize
  let { data, level } = SS.serialize(f, lub(__sched.pc, nodeid.lev));

  let trustLevel = nodeTrustLevel(node.nodeId);

  if (!flowsTo(level, trustLevel)) {
    threadError("Illegal trust flow when spawning on a remote node\n" +
      ` | the trust level of the recepient node: ${trustLevel.stringRep()}\n` +
      ` | the level of the information in spawn: ${level.stringRep()}`)
  }


  // 0. we assume that the node is different from
  //    the local node

  // 1. we make a connection to the remote node
  // 2. we send the serialized version of f
  // 3. we wait for the reply (should be a pid)
  // 4. we return the obtained pid
  //--------------------------------------------------


  let theThread = __sched.__currentThread;

  try {
    let body1 = await localNode.spawnp2p(node.nodeId, data);
    // todo-api: localhost/../serialize
    let body:any  = await SS.deserializeAsync(nodeTrustLevel(node.nodeId), body1)
    let pid = new ProcessID(body.val.uuid, body.val.pid, body.val.node);
    theThread.returnInThread(new LVal(pid, body.lev));

    __sched.scheduleThreadT(theThread);
    __sched.resumeLoopAsync();

  } catch (err) {
    debug("error spawning remotely; this blocks current thread" + err)
  }
}



function remoteSpawnOK() {
  console.log("remoteSpawnOK");
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
async function spawnFromRemote(jsonObj, fromNode) {
  console.log("spawnFromRemote");

  // 2018-05-17: AA; note that this _only_ uses the lf.lev and
  // is completely independent of the current thread's pc;

  let nodeLev = nodeTrustLevel(fromNode);

  // todo-api: localhost/../serialize
  let lf: any = await SS.deserializeAsync(nodeLev, jsonObj)
  let f = lf.val;
  let newPid = __sched.scheduleNewThreadAtLevel(
      f.fun, 
      [f.env, __unit], 
      f.namespace, 
      lf.lev, 
      lf.lev
    );

  // 2018-09-19: AA: because we need to send some info back, we have to invoke
  // serialization.

  // todo-api: localhost/../serialize
  let serObj = SS.serialize(newPid, levels.BOT).data
  __sched.resumeLoopAsync();
  return (serObj);
}



function rt_raisedToLev(x, y) {
  return new LVal(x.val, lub(x.lev, y));
}






function persist(obj, path) {
  // todo-api: localhost/../serialize
  let jsonObj = SS.serialize(obj, __sched.pc).data;
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
async function receiveFromRemote(pid, jsonObj, fromNode) {
  console.log("receiveFromRemote")
  // todo-api: localhost/../serialize
  let data:any = await SS.deserializeAsync(nodeTrustLevel(fromNode), jsonObj)
  // debug ("* rt receiveFromremote * " + fromNode);

  // TODO: 2018-07-23: do we need to do some more raising
  // about the level of the fromNode?; AA

  let fromNodeId = __sched.mkVal(fromNode);
  let toPid = new LVal(new ProcessID(rt_uuid, pid, __nodeManager.getLocalNode()), data.lev);
  __theMailbox.addMessage(fromNodeId, toPid, data.val, data.lev);
  __sched.resumeLoopAsync();

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
  let node = toPid.node.nodeId;
  let pid = toPid.pid;
  // debug ("* rt *", toPid, message);

  // todo-api: localhost/../serialize
  let { data, level } = SS.serialize(new LVal(message, __sched.pc), __sched.pc);
  let trustLevel = nodeTrustLevel(node);

  // debug ("data level: " +  level.stringRep());
  // debug ("remote trust level: " + trustLevel.stringRep());

  if (!flowsTo(level, trustLevel)) {
    threadError("Illegal trust flow when sending information to a remote node\n" +
      ` | the trust level of the recepient node: ${trustLevel.stringRep()}\n` +
      ` | the level of the information to send:  ${level.stringRep()}`);
  } else {
    localNode.sendp2p(node, pid, data)
    rt_ret(__unit); // we return unit to the call site at the thread level
  }
}


function isLocalPid(pid) {
  let x = pid.uuid.toString() == rt_uuid.toString();
  return (x);
}

function rt_mkuuid() {
  let pid = uuidv4();
  let uuidval = rt_mkVal(pid);
  return uuidval;
}

function rt_sendMessageNochecks(lRecipientPid, message, ret = true) {

  let recipientPid = lRecipientPid.val;

  if (isLocalPid(recipientPid)) {
    let nodeId = __sched.mkVal(__nodeManager.getNodeId());
    __theMailbox.addMessage(nodeId, lRecipientPid, message, __sched.pc);

    if (ret) {
      rt_ret(__unit);
    }
  } else {
    // debug ("* rt rt_send remote *", recipientPid, message);
    sendMessageToRemote(recipientPid, message)
  }
}




//////// INIT ////////

function initRuntime() {
  debug(`Initializing`);
  __sched = new Scheduler(rt_uuid);
  debug(`Initialized Scheduler i.e. __sched`);
  __theMailbox = new MailboxProcessor(__sched);
  debug(`Initialized MailboxProcessor i.e. __theMailbox`);

  //todo: fix yargs
  aliases = {} /*yargs.argv.aliases
                  ? JSON.parse ( fs.readFileSync(yargs.argv.aliases))
                  : {}*/
  __nodeManager = new NodeManager(levels, aliases); // 2019-01-03: todo: use options; AA
  debug(`Initialized NodeManager i.e. __nodeManager`);


  mkBase = (f, name = null) => __sched.mkBase(f, name);
  rt_mkVal = (x) => __sched.mkVal(x);
  rt_mkValPos = (val: string, pos: string) => __sched.mkValPos(val, pos);
  rt_mkCopy = (x) => __sched.mkCopy(x);
  raiseCurrentThreadPC = (l) => __sched.__currentThread.raiseCurrentThreadPC(l);
  raiseCurrentThreadPCToBlockingLev = (l?) => __sched.__currentThread.raiseCurrentThreadPCToBlockingLev(l);
  raiseCurrentBlockingThreadLev = (l) => __sched.__currentThread.raiseBlockingThreadLev(l);
  currentThreadPid = () => __sched.currentThreadId;
  __unit = __sched.__unit;


  rt_self = mkBase((env, arg) => {
    // debug ("* rt self", currentPid);
    rt_ret(currentThreadPid());
  }, "self");

  rt_sleep = mkBase((env, arg) => {
    assertIsNumber(arg);
    let delay = arg.val;
    let theThread = __sched.__currentThread;
    theThread.sleeping = true;
    theThread.timeoutObject =
      setTimeout(() => {
        __sched.__currentThread = theThread;   // probably unnecessary because we don't create any labeled values here.
        theThread.sleeping = false;
        theThread.timeoutObject = null;
        theThread.returnInThread(__unit);

        __sched.scheduleThreadT(theThread);
        __sched.resumeLoopAsync();

      }, delay)
  }, "sleep");

  rt_sandbox = mkBase((env, arg) => {
    console.log("sandbox");
    assertIsNTuple(arg, 2);
    let theThread = __sched.__currentThread;
    let threadState = theThread.exportState()


    let done = false;
    let trapperInvoked = false;

    let delay = arg.val[0];
    let retVal = null;
    raiseCurrentThreadPC(delay.lev);

    function mk_tupleVal(x) {
      return theThread.mkVal(rt_mkTuple(x));
    }

    function ok(x, l) {
      let statusOk = __sched.__currentThread.mkValWithLev(true, l);
      let y = rt_raisedToLev(x, l);
      return mk_tupleVal([statusOk, y]);
    }

    function bad(x, l) {
      let statusBad = __sched.__currentThread.mkValWithLev(false, l);
      let y = rt_raisedToLev(x, l);
      return mk_tupleVal([statusBad, y])
    }

    setTimeout(() => {
      theThread.handlerState = new SandboxStatus.NORMAL();
      let resultLabel = __sched.blockingTopLev;

      // Restore the state back to what it was before starting the sandboxing

      theThread.importState(threadState);

      // __sched.raiseCurrentThreadPCToBlockingLev();

      // 2019-01-31: AA; obs: this is subtle

      // we check whether the thread is no longer scheduled
      if (done || trapperInvoked || theThread.sleeping) {
        console.log("sandbox done: ", done);
        console.log("sandbox trapperInvoked: ", trapperInvoked);
        console.log("sandbox theThread.sleeping: ", theThread.sleeping);
        if (done) {
          console.log("sandbox: thread is done");
          theThread.returnInThread(ok(retVal, resultLabel));
        } else {
          if (theThread.sleeping) {
            console.log("sandbox: thread is sleeping");
            theThread.sleeping = false;
            clearTimeout(theThread.timeoutObject);
          }
          console.log("sandbox inside timeout");
          theThread.returnInThread(bad(__unit, resultLabel));
        }

        // because the thread has finished, we need 
        // to push it back into the thread pool

        __sched.scheduleThreadT(theThread);
        __sched.resumeLoopAsync();

      } else {
        console.log("sandbox: thread is no longer scheduled");
        theThread.killCounter++;
        // the thread is alive and is somewhere in the scheduler queue, so
        // we just change its return kont
        theThread.returnInThread(bad(__unit, resultLabel));
      }
    }, delay.val)


    /*
    let barrierClosure = new RtClosure ({ret:null}, null, (env, arg) => {  
      retVal = arg;
      done = true;
    });
    */

    let guard = (arg) => {
      retVal = arg;
      done = true;
    }


    let trapper = mkBase((env, arg) => {
      trapperInvoked = true;
      retVal = __unit;
    })

    // __sched.setret (barrierClosure);
    __sched.__currentThread.callInThread(guard);
    theThread.handlerState = new SandboxStatus.INSANDBOX(trapper);
    theThread.barrierdepth = 0;
    rt_tailcall(arg.val[1], __unit);
    try {
      
    } catch (e) {
      console.log("TAILCALL in sandbox ERROR!");
    }
    

  }, "sandbox");

  rt_spawn = mkBase((env, larg) => {
    try {
      assertNormalState("spawn");
    } catch (e) {
      console.log("SPAWN Error");
      throw e;
    }
    
    
    // debug ("* rt rt_spawn *", larg.val, larg.lev);
    raiseCurrentThreadPC(larg.lev);
    let arg = larg.val;

    function spawnLocal(arg) {
      // debug ("scheduled rt_spawn ", arg.fun);

      let newPid = __sched.scheduleNewThreadAtLevel(
        arg.fun,
        [arg.env, __unit],
        arg.namespace,
        __sched.pc,
        __sched.blockingTopLev)
      rt_ret(newPid);
    }


    if (Array.isArray(arg)) {
      if (__nodeManager.isLocalNode(arg[0].val)) { // check if we are at the same node or note
        // debug ("SAME NODE")
        raiseCurrentThreadPC(lub(arg[0].lev, arg[1].lev));
        assertIsFunction(arg[1]);
        spawnLocal(arg[1].val)
      } else {
        assertIsNode(arg[0]);
        assertIsFunction(arg[1]);
        return spawnAtNode(arg[0], arg[1])
      }
    } else {
      assertIsFunction(larg);
      spawnLocal(arg)
    }
  }, "spawn");


  rt_save = mkBase((env, larg) => {
    assertIsNTuple(larg, 2);
    raiseCurrentThreadPC(larg.lev);
    let arg = larg.val;
    let file = arg[0].val;
    let data = arg[1];
    persist(data, "./out/saved." + file + ".json")
    rt_ret(__unit);
  }, "save");


  rt_restore = mkBase((env, arg) => {
    assertIsString(arg)
    let theThread = __sched.__currentThread;
    let file = arg;

    (async () => {
      let jsonStr = await fs.promises.readFile("./out/saved." + file.val + ".json");
      // todo-api: localhost/../serialize
      let data = await SS.deserializeAsync(levels.TOP, JSON.parse(jsonStr));
      theThread.returnInThread(data);
      __sched.scheduleThreadT(theThread);
      __sched.resumeLoopAsync();

    })()
  }, "restore");

  rt_send = mkBase((env, larg) => {
    raiseCurrentThreadPCToBlockingLev();
    assertNormalState("send")
    raiseCurrentThreadPC(larg.lev);
    assertIsNTuple(larg, 2);
    assertIsProcessId(larg.val[0]);
    let arg = larg.val;
    // we need to check whether the recipient process is local
    // if yes, then we just proceed by adding the message to the
    // local mailbox; otherwise we need to proceed to serialization
    // external call.

    let lRecipientPid = arg[0];
    // debug ("* rt rt_send *", lRecipientPid);
    raiseCurrentThreadPC(lRecipientPid.lev); // this feels a bit odd.
    let message = arg[1];

    rt_sendMessageNochecks(lRecipientPid, message)

  }, "send");

  
  rt_receive = mkBase(baseRcv);
  rt_rcvp = mkBase(receiveAtOneLevel);
  rt_rcv = mkBase(receiveBoundedRangeWithAuthority);


  rt_exit = mkBase((env, arg) => {
    assertNormalState("exit");
    assertIsNTuple(arg, 2);
    assertIsAuthority(arg.val[0]);
    assertIsNumber(arg.val[1]);
    assertIsTopAuthority(arg.val[0]);
    cleanup();
    //process.exit(arg.val[1].val);
  }, "exit");


  rt_getTime = mkBase((env, arg) => {
    assertIsUnit(arg)
    let d = new Date()
    let t = d.getTime()
    let v = new LVal(t, __sched.pc);
    rt_ret(v)
  });


  rt_printWithLabels = mkBase((env, arg) => {
    log(
      __sched.__currentThread.mkCopy(arg).stringRep(false)
    );

    rt_ret(__unit);
  }, "printWithLabels");


  
  rt_toString = mkBase((env, arg) => {
    let taintRef = { lev: __sched.pc };
    let s = __sched.__currentThread.mkCopy(arg).stringRep
      (true,  // omit labels
        taintRef  // accumulate taint into this reference
      )

    let r = __sched.__currentThread.mkValWithLev(s, taintRef.lev);
    rt_ret(r);
  }, "toString");


  
  rt_toStringLabeled = mkBase((env, arg) => {
    let v = __sched.__currentThread.mkCopy(arg);
    let taintRef = { lev: __sched.pc };

    let s = v.stringRep(false,  // do not omit labels 
      taintRef  // accumulate taint into this reference
    )



    let r = __sched.__currentThread.mkValWithLev(s, taintRef.lev);


    rt_ret(r);
  }, "toStringLabeled");


  rt_print = mkBase((env, arg) => {
    log(
      // colors.green (formatToN ( "PID:" +  __sched.currentThreadId.stringRep(), 30)),
      // colors.green (formatToN ( "PC:" +  __sched.pc.stringRep(), 20)),
      // colors.green (formatToN ( "BL:" +  __sched.blockingTopLev.stringRep(), 20)),
      arg.stringRep(true)
    );

    rt_ret(__unit);
  }, "print");


  rt_printString = mkBase((env, arg) => {
    assertIsString(arg);
    log(arg.val)
    rt_ret(__unit);
  }, "printString");


  rt_writeString = mkBase((env, arg) => {
    assertIsString(arg);
    //todo: substitute below
    //process.stdout.write(arg.val)
    rt_ret(__unit);
  }, "writeString");

  rt_question = mkBase((env, arg) => {
    //readline.removeListener ('line', lineListener);
    //term.removeListener ('line', lineListener);
    let theThread = __sched.__currentThread;

    assertIsString(arg);
    theThread.raiseBlockingThreadLev(levels.TOP)

    /*
    readline.question (arg.val, (s) => {
      let r = theThread.mkValWithLev (s, levels.TOP)
      theThread.returnInThread (r)
      __sched.scheduleThreadT(theThread);
      __sched.resumeLoopAsync()
  
      readline.on ('line', lineListener)
  
    })*/

  }, "question");


  rt_inputline = mkBase((env, arg) => {
    assertIsUnit(arg)

    let theThread = __sched.__currentThread;
    theThread.raiseBlockingThreadLev(levels.TOP)



    if (lineBuffer.length > 0) {
      let s = lineBuffer.shift();
      let r = theThread.mkValWithLev(s, levels.TOP);

      rt_ret(r);
    } else {
      readlineCallbacks.push((s) => {

        let r = theThread.mkValWithLev(s, levels.TOP)
        theThread.returnInThread(r)
        __sched.scheduleThreadT(theThread);
        __sched.resumeLoopAsync()
      })
    }
  }, "inputLine");


  rt_debug = function (s) {

    let tid = __sched.__currentThread.tid.stringRep()
    let pid = __sched.pc.stringRep()
    let bid = __sched.blockingTopLev.stringRep()
    log(
      colors.red(formatToN("PID:" + tid, 50)) + " " +
      colors.red(formatToN("PC:" + pid, 20)) + " " +
      colors.red(formatToN("BL:" + bid, 20)) + " " +
      s 
    );
  };

  rt_attenuate = mkBase((env, arg) => {
    assertIsNTuple(arg, 2);
    let argv = arg.val;
    let authFrom = argv[0];
    assertIsAuthority(authFrom);
    let levTo = argv[1];
    assertIsLevel(levTo);

    let ok_to_attenuate = flowsTo(levTo.val, authFrom.val.authorityLevel);

    // todo: 2018-10-18: AA; are we missing anything?
    let l_meta = lubs([__sched.pc, arg.lev, authFrom.lev, levTo.lev])
    let l_auth = ok_to_attenuate ? levTo.val : levels.BOT;
    let r = new LVal(new Authority(l_auth), l_meta)

    rt_ret(r)
  }, "attenuate");


  rt_declassify = mkBase((env, arg) => {
    //  assertDeclassificationAllowed()// 2019-03-06: AA: allowing declassification everywhere?
    assertIsNTuple(arg, 3);

    let argv = arg.val;
    let data = argv[0];

    let auth = argv[1];
    assertIsAuthority(auth);

    let toLevV = argv[2];
    assertIsLevel(toLevV);

    let pc = __sched.pc;

    let levFrom = data.lev;

    // check that levFrom ⊑ auth ⊔ levTo
    let _l = lubs([auth.val.authorityLevel, toLevV.val]);


    let ok_to_declassify =
      flowsTo(levFrom, _l)

    if (ok_to_declassify) {
      // we need to collect all the restrictions
      let r = new LVal(data.val, lubs([toLevV.val, toLevV.lev, pc, arg.lev, auth.lev]));
      rt_ret(r) // schedule the return value
    } else {
      let errorMessage =
        "Not enough authority for declassification\n" +
        ` | level of the data: ${data.lev.stringRep()}\n` +
        ` | level of the authority: ${auth.val.authorityLevel.stringRep()}\n` +
        ` | target level of the declassification: ${toLevV.val.stringRep()}`
      threadError(errorMessage);

      // return; // nothing scheduled; should be unreachabele
    }

  }, "declassify");

  rt_raiseTrust = mkBase((env, arg) => {
    assertNormalState("raise trust");
    assertIsNTuple(arg, 3)

    let argv = arg.val;
    let data = argv[0];
    assertIsString(data);

    let authFrom = argv[1];
    assertIsAuthority(authFrom);
    assertIsTopAuthority(authFrom); // AA; 2019-03-07: may be a bit pessimistic, but okay for now
    let levTo = argv[2];
    assertIsLevel(levTo);

    let ok_to_raise = flowsTo(levTo.val, authFrom.val.authorityLevel);
    // AA, 2018-10-20 : beware that no information flow is enforced here
    // let l_meta = lubs ([__sched.pc, arg.lev, authFrom.lev, levTo.lev])
    let l_raise = ok_to_raise ? levTo.val : levels.BOT;
    let nodeId = data.val;
    let currentLevel = nodeTrustLevel(nodeId)
    _trustMap[nodeId] = lub(currentLevel, l_raise);
    rt_ret(__unit);
  }, "raiseTrust");


  /**
   * Returns a string corresponding to the node identify
   * from a process
   */
  rt_nodeFromProcess = mkBase((env, arg) => {
    assertIsProcessId(arg);
    let data = arg.val;
    let nodeId = data.node.nodeId;
    let v = new LVal(nodeId, arg.lev);
    rt_ret(v);
  }, "node");


  // TODO: check that the arguments to the register are actually pids

  rt_register = mkBase((env, arg) => {
    assertNormalState("register")
    assertIsNTuple(arg, 3);
    assertIsString(arg.val[0]);
    assertIsProcessId(arg.val[1]);

    assertIsAuthority(arg.val[2]);
    assertIsTopAuthority(arg.val[2]);

    // TODO: 2018-07-29: info flow checks
    // this is needed, because registration
    // is stateful

    let k = arg.val[0].val;
    let v = arg.val[1];

    __theRegister[k] = v;
    rt_ret(__unit);
  }, "register");

  rt_whereis = mkBase((env, arg) => {
    assertNormalState("whereis");

    assertIsNTuple(arg, 2);
    assertIsNode(arg.val[0]);
    assertIsString(arg.val[1]);
    raiseCurrentBlockingThreadLev(arg.val[0].lev);
    raiseCurrentBlockingThreadLev(arg.val[1].lev);


    // let n = dealias(arg.val[0].val);    
    let n = __nodeManager.getNode(arg.val[0].val).nodeId;

    let k = arg.val[1].val;

    let nodeLev = nodeTrustLevel(n);
    let theThread = __sched.__currentThread;

    let okToLookup = flowsTo(lubs([__sched.pc, arg.val[0].lev, arg.val[1].lev]), nodeLev);
    if (!okToLookup) {
      threadError("Information flow violation in whereis");
      return;
    }

    if (__nodeManager.isLocalNode(n)) {
      if (__theRegister[k]) {
        rt_ret(theThread.mkVal(__theRegister[k]))
      }
    } else {
      (async () => {
        try {
          let body1 = await localNode.whereisp2p(n, k);
          // todo-api: localhost/../serialize
          let body:any = await SS.deserializeAsync(nodeTrustLevel(n), body1);
          let pid = new ProcessID(body.val.uuid, body.val.pid, body.val.node);

          theThread.returnInThread(theThread.mkValWithLev(pid, body.lev));
          __sched.scheduleThreadT(theThread);
          __sched.resumeLoopAsync();

        } catch (err) {
          debug("whereis error: " + err.toString())
        }

      })();
    }
  }, "whereis");

  rt_ret = (arg) => {
    console.log("rt ret");
    __sched.returnInThread(arg);
  }

  rt_localStorageWrite = mkBase((env, arg) => {
    try {
      assertNormalState("localStorageWrite");
    } catch (e) {
      console.log(e);
      logger.warning("localStorageWrite is not allowed inside sandbox");
      return;
    }
    
    //assertIsNTuple(arg, 2); // we might have 3
    assertIsString(arg.val[0]);
    let keyName = arg.val[0].val;
    let data = arg.val[1];
    let level: Set<string> = arg.val[2] != null ? arg.val[2].val.lev : null;

    if (level != null) {
      let key = {"keyName": keyName, "level": level};
      let serializeObj = SS.serialize(data, __sched.pc).data;
      localStorage.setItem(JSON.stringify(key), JSON.stringify(serializeObj));
    } else {
      let key = {"keyName": keyName}
      let serializeObj = SS.serialize(data, __sched.pc).data;
      localStorage.setItem(JSON.stringify(key), JSON.stringify(serializeObj));
    }
    
    rt_ret(__unit);
  }, "localStorageWrite");

  rt_localStorageRead = mkBase( (env, arg) => {
    assertNormalState("localStorageRead");
    let key;
    if (typeof arg.val === 'string') {
       key = {"keyName": arg.val};
    } else {
      assertIsNTuple(arg, 2);
      assertIsString(arg.val[0]);
      let keyName = arg.val[0].val;
      let level: Set<string> = arg.val[1].val.lev;
      key = {"keyName": keyName, "level": level}
    }

    //let data = await localStorage.getItem(JSON.stringify(key));
    let data = localStorage.getItem(JSON.stringify(key));
    if (data == null) {
      let err_mess= `This variable does not exist in local storage: '${JSON.stringify(key)}'`;
      logger.error(err_mess);
      threadError(err_mess);
    } else {
      (async () => {
      try {
        //let lval = await SS.deserializeAsync(levels.TOP, JSON.parse(data));
        let lval = await SS.deserializeAsync(levels.TOP, JSON.parse(data));
        rt_ret(lval);
      } catch (e) {
        let err_mess = "Something went wrong in deserializing the local storage variable: " + JSON.stringify(key);
        logger.error(err_mess);
        threadError(err_mess);
        console.log(e);
      }})();
    }
     
  }, "rt_localStorageRead");

  rt_localStorageDelete = mkBase((env, arg) => {
    assertIsString(arg);
    localStorage.removeItem(arg.val);
    rt_ret(__unit);
  }, "rt_localStorageDelete");

}

try {
  initRuntime();
} catch (e) {
  console.log("InitRuntime Error");
  logger.error(e);
}






function okToDeclassify(levFrom, levTo, auth) {
  let _l = lubs([auth.val.authorityLevel, levTo.val]);
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
  assertIsLevel(arg.val[0])
  assertIsLevel(arg.val[1])
  assertIsAuthority(arg.val[2])
  assertIsList(arg.val[3])
  let lowb = arg.val[0]
  let highb = arg.val[1]
  let auth = arg.val[2]
  let handlers = arg.val[3]


  let is_sufficient_authority =
    okToDeclassify(highb, lowb, auth);

  if (is_sufficient_authority) {
    _receiveFromMailbox(lowb, highb, handlers)
  } else {
    let errorMessage =
      "Not enough authority for ranged receive\n" +
      ` | lower bound: ${lowb.stringRep()}\n` +
      ` | upper bound: need to fix this` +//${highb.val.stringRep()}`
      ` | authority:  ${auth.val.authorityLevel.stringRep()}\n`
    threadError(errorMessage);
  }
}

function receiveAtOneLevel(env, arg) {
  assertNormalState("receive")
  assertIsNTuple(arg, 2)
  assertIsLevel(arg.val[0])
  assertIsList(arg.val[1])
  let lev = arg.val[0]
  let handlers = arg.val[1];
  _receiveFromMailbox(lev, lev, handlers)
}


function baseRcv(env, handlers) {
  assertNormalState("receive")
  assertIsList(handlers)
  __theMailbox.rcv(__sched.pc, __sched.pc, handlers);

}



function formatToN(s, n) {
  if (s.length < n) {
    let j = s.length;
    for (; j < n; j++) {
      s = s + " ";
    }
  }
  return s;
}

async function whereisFromRemote(k) {
  __sched.resumeLoopAsync()
  // TODO: 2018-10-20: make use of the levels as they were
  // recorded during the registration (instead of the bottom here )
  if (__theRegister[k]) {
    // todo-api: localhost/../serialize
    let serObj = SS.serialize(__theRegister[k], levels.BOT).data
    return serObj
  }
}


let baseMkSecret = function (env, x) {
  // debug ("making secret " + x.val)
  rt_ret(new LVal(x.val, levels.TOP))
}


let baseDisclose = function (env, x) {
  assertNormalState("baseDisclose");
  // assert that
  // pc ⊔ x.lev ⊑ LOW

  if (!flowsTo(lub(__sched.joinedLev, x.lev), levels.BOT)) {
    threadError("Illegal flow in adv function:\n" +
      ` |    pc: ${__sched.pc.stringRep()}\n` +
      ` | block: ${__sched.blockingTopLev.stringRep()}\n` +
      ` | value: ${x.stringRep()}`)
  }
  rt_ret(__unit);
}



// --------------------------------------------------
function rt_setret(namespace, kf, e) {
  // assertIsEnv(e);
  let r = new RtClosure(e, namespace, kf);
  //__sched.setret(r); //todo - tc: this method is not declared in Scheduler
}

function rt_mkLabel(x) {
  // debug ("mkLabel", x, x === "secret");

  return new LVal(levels.mkLevel(x), __sched.pc);

}


function listStringRep(x, omitLevels = false, taintRef = null) {
  if (x.length == 0) {
    return "";
  }
  let s = x[0].stringRep(omitLevels, taintRef);

  for (let i = 1; i < x.length; i++) {
    s += ", " + x[i].stringRep(omitLevels, taintRef);
  }
  return s;
}

function rt_mkTuple(x) {
  console.log("rt_mkTuple");
  x.stringRep = function (omitLevels = false, taintRef = null) {
    return ("(" + listStringRep(x, omitLevels, taintRef) + ")")
  }
  x.isTuple = true;
  return x;
}

function rt_mkList(x) {
  x.stringRep = function (omitLevels = false, taintRef = null) {
    return ("[" + listStringRep(x, omitLevels, taintRef) + "]")
  }
  x.isList = true;
  return x;
}


function threadError(s, internal = false) {
  return __sched.__currentThread.threadError(s, internal);
}




function rt_error(x) {
  console.log("rt_error");
  threadError(x.val);
}

function rt_errorPos(x, pos) {
  console.log("rt_errorPos");
  if (pos != '') {
    threadError(x.val + " at " + pos);
  } else {
    threadError(x.val);
  }
}

function rt_tailcall(lff, arg) {
  console.log("rt_tailcall");
  try {
    assertIsFunction(lff);
    if (!lff.val.fun) {
      log("UNDEF FUN")
    }
    raiseCurrentThreadPC(lff.lev);

    let ff = lff.val;
    //__sched.tailNext ( () => {  ff.fun.apply (ff.namespace, [ff.env, arg]) } );
    // __sched.tailNext ( () => { ff.fun (ff.env, arg) } );
    __sched.tail(ff.fun, ff.env, arg, ff.namespace);
  } catch (e) {
    console.log("rt_tailcall error");
    throw e;
  }
}

function runtimeEquals(o1, o2) {
  if (typeof o1.atom != "undefined" && typeof o2.atom != "undefined") {
    // obs: atoms operate in a global namespace; 2018-03-09; aa
    return (o1.atom == o2.atom)
  }


  if (typeof o1.pid != "undefined" &&
    typeof o2.pid != "undefined") {
    return (proc.pid_val_equals(o1, o2));
  } else {
    return (o1 == o2)
  }
}


function rt_loadLib(lib, decl, obj) {
  // load the lib from the linked data structure
  let r = obj.libs[lib + "." + decl];
  let rv = rt_mkVal(r);
  // rt_debug("loading lib " + decl);
  return rv;
}


function rt_linkLibs(libs, obj, cb) {
  obj.libs = {}
  loadLibs.loadLibsAsync(libs, obj, cb, rtObj);
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
    threadError("value " + x.stringRep() + " is not a boolean")
  }
}


function assertIsNumber(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (typeof x.val != 'number') {
    threadError("value " + x.stringRep() + " is not a number")
  }
}


function assertIsFunction(x, internal = false) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!((x.val instanceof RtClosure) || (x.val instanceof BaseFunction))) {
    threadError("value " + x.stringRep() + " is not a function", internal)
  }
}

function assertIsHandler(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(x.val instanceof RtClosure)) { // 2018-12-10: AA: in the future we may need to change this to special handler class
    threadError("value " + x.stringRep() + " is not a handler")
  }
}

function assertIsUnit(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (x.val != __unitbase) {
    threadError("value " + x.stringRep() + " is not unit")
  }

}

function assertIsListOrTuple(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(Array.isArray(x.val) && (isListFlagSet(x.val) || isTupleFlagSet(x.val)))) {
    threadError("value " + x.stringRep() + " is not a list")
  }
}

function assertIsList(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(Array.isArray(x.val) && isListFlagSet(x.val))) {
    threadError("value " + x.stringRep() + " is not a list")
  }
}

function assertIsNTuple(x, n) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(Array.isArray(x.val) && isTupleFlagSet(x.val) && x.val.length == n)) {
    threadError("value " + x.stringRep() + " is not a " + n + "-tuple")
  }
}

function assertIsString(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (typeof x.val != 'string') {
    threadError("value " + x.stringRep() + " is not a string")
  }
}


function assertIsNode(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (typeof x.val != 'string') {
    threadError("value " + x.stringRep() + " is not a node string") // todo: check for it being a proper nodeid format?
  }
}



function assertIsProcessId(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(x.val instanceof ProcessID)) {
    threadError("value " + x.stringRep() + " is not a process id")
  }
}

function assertIsLevel(x) {
  raiseCurrentBlockingThreadLev(x.tlev);
  if (!(x.val instanceof Level)) {
    threadError("value " + x.stringRep() + " is not a level");
  }
}

function assertIsTopAuthority(x) {
  let isTop = flowsTo(levels.TOP, x.val.authorityLevel);
  if (!isTop) {
    let errorMessage =
      "Provided authority is not TOP\n" +
      ` | level of the provided authority: ${x.val.authorityLevel.stringRep()}`
    threadError(errorMessage);
  }
}

function assertIsAuthority(x) {
  raiseCurrentBlockingThreadLev(x.tlev);

  if (!(x.val instanceof Authority)) {
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
    threadError("invalid handler state in " + s + " -- side effects are prohbited in handler pattern matching or sandboxed code")
  }
}

function assertDeclassificationAllowed(s) {
  if (!__sched.handlerState.declassificationAllowed()) {
    threadError("invalid handler state in " + s + ": declassification prohibited in handler pattern matching")
  }
}



function assertPairAreNumbers(x, y) {
  assertIsNumber(x);
  assertIsNumber(y);
}

function assertPairAreStringsOrNumbers(x, y) {
  raiseCurrentBlockingThreadLev(x.tlev);
  switch (typeof x.val) {
    case 'number': assertIsNumber(y); break;
    case 'string': assertIsString(y); break;
    default: threadError("values " + x.stringRep() + " and " + y.stringRep() + " are of different types")
  }
}

function RuntimeObject() {
  this.Atom = function (name, creation_uuid = rt_uuid) {
    let atm = {
      atom: name,
      creation_uuid: creation_uuid,
      stringRep: function (omitLevels = false) {
        return name
      }
    }
    return atm
  }
  this.assertIsHandler = assertIsHandler
  this.assertIsNTuple = assertIsNTuple
  this.assertIsFunction = assertIsFunction
  this.Authority = Authority;
  this.ProcessID = ProcessID;
  this.LVal = LVal;
  this.lub = lub;
  this.glb = glb;
  this.error = rt_error;
  this.errorPos = rt_errorPos;
  this.threadError = threadError;
  this.Closure = RtClosure;
  this.Env = RtEnv;
  this.setret = rt_setret
  // this.resetret = rt_resetret
  this.ret = rt_ret
  this.__unitbase = __unitbase
  this.__unit = __unit
  this.rt_uuid = __sched.rt_uuid
  this.tailcall = rt_tailcall
  this.mkVal = rt_mkVal
  this.mkValPos = rt_mkValPos
  this.mkCopy = rt_mkCopy
  this.mkTuple = rt_mkTuple
  this.mkList = rt_mkList
  this.loadLib = rt_loadLib
  this.debug = rt_debug
  this.linkLibs = rt_linkLibs
  this.levels = levels
  this.persist = persist
  this.mkLabel = rt_mkLabel
  this.node = rt_nodeFromProcess;
  this.raiseTrust = rt_raiseTrust;
  this.attenuate = rt_attenuate;
  this.declassify = rt_declassify;
  this.toStringL = rt_toStringLabeled;
  this.toString = rt_toString;
  this.getTime = rt_getTime;
  this.print = rt_print;
  this.printWithLabels = rt_printWithLabels;
  this.printString = rt_printString
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
  this.raisedTo = function (x, y) {
    return new LVal(x.val, lub(lub(x.lev, y.val), y.lev), lubs([x.tlev, y.tlev, __sched.pc]))
  }

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
    return new LVal(-x.val, x.lev, x.tlev)
  }




  this.debugpc = mkBase((env, arg) => {
    //    assertIsString(arg);
    rt_debug("");
    rt_ret(__unit);
  })


  this.eq = function (x, y) {
    return new LVal(runtimeEquals(x.val, y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.neq = function (x, y) {
    return new LVal(!(runtimeEquals(x.val, y.val)), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }

  this.stringConcat = function (x, y) {
    assertIsString(x);
    assertIsString(y);
    return new LVal((x.val + y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev));
  }

  this.plus = function (x, y) {
    //    assertPairAreNumbers(x,y);
    assertPairAreStringsOrNumbers(x, y);
    return new LVal((x.val + y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.minus = function (x, y) {
    assertPairAreNumbers(x, y);
    let rv = new LVal((x.val - y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
    return rv;
  }
  this.mult = function (x, y) {
    assertPairAreNumbers(x, y);
    return new LVal((x.val * y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.div = function (x, y) {
    assertPairAreNumbers(x, y);
    return new LVal((x.val / y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.le = function (x, y) {
    assertPairAreStringsOrNumbers(x, y);
    return new LVal((x.val <= y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.lt = function (x, y) {
    assertPairAreStringsOrNumbers(x, y);
    return new LVal((x.val < y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.ge = function (x, y) {
    assertPairAreStringsOrNumbers(x, y);
    return new LVal((x.val >= y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.gt = function (x, y) {
    assertPairAreStringsOrNumbers(x, y);
    return new LVal((x.val > y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.and = function (x, y) {
    assertIsBoolean(x);
    assertIsBoolean(y);
    return new LVal((x.val && y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.or = function (x, y) {
    assertIsBoolean(x);
    assertIsBoolean(y);
    return new LVal((x.val || y.val), lub(x.lev, y.lev), lub(x.tlev, y.tlev))
  }
  this.index = function (x, y) {
    assertIsListOrTuple(x);
    assertIsNumber(y);
    let z = x.val[y.val];
    return new LVal(z.val, lub(lub(x.lev, y.lev), z.lev), lubs([x.tlev, y.tlev, z.tlev]))
  }
  this.islist = function (x) {
    return new LVal(Array.isArray(x.val) && isListFlagSet(x.val), x.lev, x.tlev)
  }
  this.istuple = function (x) {
    return new LVal(Array.isArray(x.val) && isTupleFlagSet(x.val), x.lev, x.tlev)
  }
  this.cons = function (a, b) {
    assertIsList(b) // 2019-03-07: AA; consider forcing the elements of the list to be of the same type (unless nil)
    let x = b.val.slice();
    x.unshift(a);
    return new LVal(rt_mkList(x), b.lev, b.tlev)
  }
  this.length = function (x) {
    assertIsListOrTuple(x);
    return new LVal(x.val.length, x.lev, x.tlev)
  }

  this.head = function (x) {
    assertIsList(x)
    let y = x.val[0];
    return new LVal(y.val, lub(y.lev, x.lev), x.tlev)
  }

  this.tail = function (x) {
    assertIsList(x)
    let y = x.val.slice(1);
    return new LVal(rt_mkList(y), x.lev, x.tlev)
  }

  this.getVal = function (x) {
    return x.val
  }
  this.branch = x => {

    raiseCurrentThreadPC(x.lev);

  }

  this.push = (x) => {
    console.log("rt push");
    __sched.__currentThread.callInThread(x);
  }

  this.assertOrError = function (x) {
    raiseCurrentBlockingThreadLev(x.lev);
  }


  this.levelOf = mkBase((env, arg) => {
    let l = arg.lev;
    rt_ret(new LVal(l, lub(__sched.pc, l)))
  })


  this.flowsTo = mkBase((env, arg) => {
    assertIsNTuple(arg, 2);
    let x = arg.val[0];
    let y = arg.val[1];

    assertIsLevel(x);
    assertIsLevel(y);

    rt_ret(new LVal(flowsTo(x.val, y.val), lub(__sched.pc, lub(x.lev, y.lev))))
  })


  this.pcpush = mkBase((env, arg) => {
    assertNormalState("pcpush");
    let cap = rt_mkuuid();
    __sched.__currentThread.pcpush(arg, cap);
    rt_ret(cap);
  })


  this.pcpop = mkBase((env, arg) => {
    assertNormalState("pcpop");
    assertIsString(arg);
    __sched.__currentThread.pcpop(arg)
  })


  this.pinipush = mkBase((env, arg) => {
    assertNormalState("pinipush");
    assertIsAuthority(arg);
    let cap = rt_mkuuid();
    __sched.__currentThread.pinipush(arg, cap);
    rt_ret(cap);
  })


  this.pinipop = mkBase((env, arg) => {
    assertNormalState("pinipop");
    assertIsString(arg)
    __sched.pinipop(arg);
  })

  /* Implementation note: 2019-01-02; AA: exit capabilities are implemented as
   * records of two functions (see MailboxProcessor.js) -- one for when the
   * handler pattern is successful, and one for when it is not. All we do in the
   * corresponding runtime functions is dynamically check the types, raise the
   * pc levels depending on the arguments, and then just call the corresponding
   * functions. The functions themselves are defined in MailboxProcessor.js.
   */


  this.setLibloadMode = () => {
    this.mkVal = (x) => new LVal(x, levels.BOT);
    this.mkValPos = (x, pos) => new LVal(x, levels.BOT, levels.BOT, pos);
    this.Env = LibEnv;
  }

  this.setNormalMode = () => {
    this.mkVal = rt_mkVal;
    this.Env = RtEnv;
  }


  this.mkuuid = mkBase((env, arg) => {
    assertIsUnit(arg);
    rt_ret(rt_mkuuid());
  });

  this.newlabel = mkBase((env, arg) => {
    assertIsUnit(arg);
    let levid = uuidv4().toString()
    rt_ret(rt_mkLabel(levid));
  })

  this.sendMessageNoChecks = rt_sendMessageNochecks;


  this.monitorlocal = mkBase((env, arg) => {
    assertNormalState("monitor");
    raiseCurrentThreadPC(arg.lev);
    assertIsProcessId(arg);

    let tid = arg.val;

    // 1. find the thread corresponding to that tid 

    let t = __sched.__alive[tid.toString()];
    // 2. update the monitor state of that thread

    let r = rt_mkuuid();
    if (t) {
      t.addMonitor(__sched.currentThreadId, r);
    }

    rt_ret(r);
  })


  this.demonitorlocal = mkBase((env, arg) => {
    assertIsString(arg);
    // mutates state; so we should be careful...
    rt_ret(__unit);


  })
}








function mkRuntime() {
  try {
    //todo: set check bool for if mkRuntime has been run - isRuntimeCreated
    rtObj = new RuntimeObject();
    debug(`Initialized RuntimeObject i.e. rtObj`);
    __theMailbox.setRuntimeObject(rtObj);
    debug(`Setting rtObj as rt in __theMailbox`);

    __sched.setRuntimeObject(rtObj);
    debug(`Setting rtObj as rt in __sched`);
    return rtObj;
  } catch (e) {
    console.log("mkRuntime Error");
  }

}


function cleanup(cb = () => { }) {
  debug(`cleanup called`);
  //term.close();
  // todo-api: localhost/../serialize                    
  SS.stopCompiler();
  if (__p2pRunning) {
    localNode.stopp2p((err) => {
      debug("stopping p2p ")
      if (err) {
        debug("p2p stop failed ", err)
      }
      else {
        debug("p2p stop OK")
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

async function startRuntime(file) {

  //todo: abort with a message if isRuntimeCreated is false
  // todo-api: localhost/../serialize
  try {
    SS.setRuntimeObj(rtObj);
  } catch (e) {
    console.log("SS.setRuntimeObj Error");
  }
  
  // debug ("runing with uuid:", rt_uuid)

  //todo: yargs
  let persist = null // yargs.argv.persist ? yargs.argv.persist : null;

  // p is either null or peerInfo.id.toB58String() (i.e. id string for localnode)
  function networkReady(p: string | null) {
    
    if (p) {
      debug("network ready")
    } else {
      debug("network not initialized")
    }

    let hostname = p;
    try {
      __nodeManager.setLocalHostPort(hostname);
    } catch (e) {
      console.log("nodeManager.setLocalHostPort Error");
    }
    

    // first thing we do is link libraries
    // once that is done; the linker function
    // will call back to our starting function
    //
    file.loadlibs(() => {
      debug(`Declaring cb for loadlibs of file STARTED`);
      // debug ("callback ok");

      // obs; 2018-03-10;aa: the order of these
      // initializations is important.
      //

      let stopWhenAllThreadsAreDone = p == null ? true : false;
      try {
        __sched.initScheduler(__nodeManager.getLocalNode(), stopWhenAllThreadsAreDone, cleanup);
      } catch (e) {
        console.log("sched.initScheduler Error");
      }
      

      let mainAuthority = new LVal(new Authority(levels.TOP), levels.BOT);
      debug(`Created mainAuthority`);

      // Creating a new process and thread and put the thread inside the funloop of the schedulor
      debug(`scheduleNewThreadAtLevel: thefun=main args=[null, mainAuthority] nm=file levpc=BOT levblock=BOT ismain=true, persist=null`);
      try {
        __sched.scheduleNewThreadAtLevel(
          file.main,
          [null, mainAuthority], // Arguments to main - env=null, authorityarg=mainAuthority
          file,
          levels.BOT,
          levels.BOT,
          true,
          persist
        );
      } catch (e) {
        console.log("sched.scheduleNewThreadAtLevel Error");
      }
      

      // This is the execution part (takes Threads out of the funloop and executes them)
      __sched.loop();


      debug(`Declaring cb for loadlibs of file ENDED`);
    });
  }

  const rtHandlers = {
    remoteSpawnOK: remoteSpawnOK,
    spawnFromRemote: spawnFromRemote,
    receiveFromRemote: receiveFromRemote,
    networkReady: networkReady,
    whereisFromRemote: whereisFromRemote
  };


  //todo: fix yargs
  const trustMapFile = "./trustmap.json" //yargs.argv.trustmap ? yargs.argv.trustmap : "trustmap.json";
  try {
    //let s = await readFile(trustMapFile);
    //let s = fs.readFileSync(trustMapFile); //this is a sync read so you dont need to make it a promise
    let s = fs.readFileSync("./trustmap.json");
    let trustList = JSON.parse(s);
    let trustMap = {}
    trustList.map(x => trustMap[x.id] = levels.mkLevel(x.level));
    _trustMap = trustMap;
  } catch (err) {
    error("cannot load trust map file: " + err);
  }




  //todo: yargs
  const allowRemoteSpawn = null //yargs.argv.rspawn ? yargs.argv.rspawn : null
  if (allowRemoteSpawn) {
    if (allowRemoteSpawn == "true") {
      _allowRemoteSpawn = true;
    }
  }

  //todo: substitute
  //process.on('unhandledRejection', up => { console.log("Unhandled rejection error"); throw up })

  //todo: yargs
  let localonly = true // yargs.argv.localonly ? yargs.argv.localonly : false;
  if (!localonly && !persist) {
    __p2pRunning = true;
  }


  //nodeIdFIle is a JSON file with predefined keys and node id
  //todo: yargs
  const nodeIdFile = null //yargs.argv.id ? yargs.argv.id : null;



  // START!
  if (nodeIdFile) {
    try {
      let nodeIdObj = fs.readFileSync(nodeIdFile)
      localNode = startp2p(JSON.parse(nodeIdObj), rtHandlers);

    } catch (err) {
      error("cannot load id file")
      //process.exit(1);
    }
  } else {
    try {
      console.log("localPersist:", localonly, persist);
      if (localonly || persist) {
        info("Skipping network creation. Observe that all external IO operations will yield a runtime error.")
        if (persist) {
          info("Running with persist flag.")
        }
        networkReady(null); // OBS: 2018-07-22: we are jumping over the network creation
      } else {
        localNode = startp2p(null, rtHandlers);
      }
    } catch (err) {
      error("uncaught exception in the runtime");
      error(err.stack);;
      //process.exit(1);      
    }
  }
}


export { mkRuntime, startRuntime }