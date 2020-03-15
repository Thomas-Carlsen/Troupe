import 'babel-polyfill';

import { Node } from './libp2p-bundle.js';

const PeerId = require('peer-id');
const PeerInfo = require('peer-info');

const pipe = require('it-pipe');
const pushable = require('./Pushable.js');
const AggregateError = require('aggregate-error');
import { map } from 'streaming-iterables';
const lp = require('it-length-prefixed');
import { mkLogger } from '../logger.js';

const uuidv4 = require('uuid/v4');

import {term} from '../term.js';


let logLevel = 'info' //yargs.argv.debug?'debug':'info';
const logger = mkLogger('p2p', logLevel);
const debug = (x) => logger.debug(x);
const info = (x) => logger.info(x);
const error = (x) => logger.error(x);

const _PROTOCOL = "/troupe/1.0.0";

let __networkPending = [];

const MessageType = {
  SPAWN: 0,
  SPAWNOK: 1,
  SEND: 2,
  TEST: 3,
  WHEREIS: 4,
  WHEREISOK: 5
}



/*
// UI elements
const status = document.getElementById('status')
const output = document.getElementById('output')

output.textContent = ''

function log(txt) {
  //console.info(txt)
  output.textContent += `${txt.trim()}\n`
};
*/


/*
document.addEventListener('DOMContentLoaded', async () => {

  const idDialer = await PeerId.createFromJSON(bobidJSON)
  const peerDialer = new PeerInfo(idDialer)
  const node = await new Node({ peerInfo: peerDialer });



  // UI elements
  const status = document.getElementById('status')
  const output = document.getElementById('output')

  output.textContent = ''

  function log(txt) {
    //console.info(txt)
    output.textContent += `${txt.trim()}\n`
  };

  // Add the signaling server address, along with our PeerId to our multiaddrs list
  // libp2p will automatically attempt to dial to the signaling server so that it can
  // receive inbound connections from other peers
  const webrtcAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star'

  node.peerInfo.multiaddrs.add(webrtcAddr)

  // Listen for new peers
  node.on('peer:discovery', (peerInfo) => {
    log(`Found peer ${peerInfo.id.toB58String()}`)
  })

  // Listen for new connections to peers
  node.on('peer:connect', (peerInfo) => {
    log(`Connected to ${peerInfo.id.toB58String()}`)
  })

  // Listen for peers disconnecting
  node.on('peer:disconnect', (peerInfo) => {
    log(`Disconnected from ${peerInfo.id.toB58String()}`)
  })

  await node.start();
  status.innerText = 'node started!';
  log(`node id is ${node.peerInfo.id.toB58String()}`);

  const listenerJson = require('./peer-id-listener.json');
  const idListener = await PeerId.createFromJSON(listenerJson)
  const peerListener = new PeerInfo(idListener)
  peerListener.multiaddrs.add('/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star')

  const obj = await node.dialProtocol(peerListener, '/echo/1.0.0')
  console.log('nodeA dialed to nodeB on protocol: /echo/1.0.0')
  console.log(obj);
  window.obj = obj;
  let stream = obj.stream;
  console.log(stream)
  const p = Pushable();
  pipe(p, stream.sink)
  pipe(stream, async function (source) {

    for await (const data of source) {
      console.log('received from liz:', data.toString())
    }

  });
  p.push("HAAAALLO!");

  //console.log(p)
  window.p = p;

  async function getit(source) {
    for await (const data of source) {
      // Output the data
      console.log('received echo:', data.toString())
    }
  }

  async function readStream() {
    pipe(stream, async function (source) {
      for await (const data of source) {
        console.log('received echo:', data.toString())
      }
    }
    );
  }
  window.stream = stream;
  window.r = readStream;
  window.g = getit;
  window.node = node;
});
*/



async function sendMessage(mess, stream) {
  const p = pushable();
  pipe(p, stream.sink)
  pipe(stream, async function (source) {
    for await (const data of source) {
      console.log('received from liz:', data.toString())
    }

  });
  p.push(mess);
}

class TroupeP2P {

  constructor(_rt, _peerInfo) {
    this._rt = _rt;
    this._peerInfo = _peerInfo;
    this._node = null; // the current node; initalized once upon start
    this._nodeTable = {}; // a table of the form [PeerId ↦ Connection]
    // This table is mutable: we populate it upon
    // discover of a node (either via dial or
    // handle), and remove entries upon
    // disconnects.
    this._spawnNonces = {}; // a table of the form [Nonce ↦ Stream].
    // This table is mutable: we populate it upon
    // issing a SPAWN to a remote node, and remove
    // entries from it upon receiving a successful
    // SPAWNOK mesasge that matches the nonce.
    this._whereisNonces  = {};
    this._relay_id = null;
    this._unacknowledged = {}

  }

  addUnacknowledged(id, uuid, f) {
    if (!this._unacknowledged[id]) {
      this._unacknowledged[id] = []
    }
    this._unacknowledged[id][uuid] = f
  }

  removeUnacknowledged(id, uuid) {
    delete this._unacknowledged[id][uuid];
  }

  /*
  async dialing() {
    const listenerJson = require('./peer-id-listener.json');
    const idListener = await PeerId.createFromJSON(listenerJson)
    const peerListener = new PeerInfo(idListener)
    peerListener.multiaddrs.add('/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star');

    return peerListener;

    // const obj = await this._node.dialProtocol(peerListener, '/echo/1.0.0')
    // console.log('nodeA dialed to nodeB on protocol: /echo/1.0.0')
    // let { stream, connection, protocol } = obj;
    // return stream;
  }
  */

  async getPeerInfoWithoutRouting(id) {
    debug(`getPeerInfoWithoutRelay: with id ${id}`);
    let peerid = await PeerId.createFromB58String(id);
    debug(`getPeerInfoWithoutRelay: with peerid ${peerid}`);
    let peerInfo = new PeerInfo(peerid);
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star');
    debug(`getPeerInfoWithoutRelay: with peerInfo ${peerInfo}`);
    return peerInfo;
  }

  reissueUnacknowledged(id) {
    for (let uuid in _unacknowledged[id]) {
      setImmediate(_unacknowledged[id][uuid])
    }
  }

  async inputHandler(id, input, fromNodeId) {
    debug("-- input handler")
    switch (input.messageType) {
      case (MessageType.SPAWN):
        if (this._rt.remoteSpawnOK()) {
          debug("RECEIVED SPAWN")
          let x = await this._rt.spawnFromRemote(input.message, fromNodeId)

          this.push_wrap(id, {
            messageType: MessageType.SPAWNOK,
            spawnNonce: input.spawnNonce,
            message: x
          });
          break;
        } // drop the message otherwise

      case (MessageType.SPAWNOK):
        debug("SPAWN OK")
        let _cb = this._spawnNonces[input.spawnNonce];
        if (_cb) {
          delete this._spawnNonces[input.spawnNonce]; // cleanup
          _cb(null, input.message); // null means no errors            
        } else {
          // something is fishy;
          debug("something is fishy; no matching callback for the nonce");
        }
        break;

      case (MessageType.SEND):
        debug(`SEND  ${id}`);
        this._rt.receiveFromRemote(
          input.pid,
          input.message,
          fromNodeId
        )
        break;

      case (MessageType.WHEREIS):
        debug("p2p whereis incoming request")
        let y = await this._rt.whereisFromRemote(input.message)
        this.push_wrap(id, {
          messageType: MessageType.WHEREISOK,
          whereisNonce: input.whereisNonce,
          message: y
        });
        debug("p2p whereis replied")
        break;

      case (MessageType.WHEREISOK):
        debug("WHEREIS OK")
        let _cbw = this._whereisNonces[input.whereisNonce];
        if (_cbw) {
          delete this._whereisNonces[input.whereisNonce];
          _cbw(null, input.message);
        } else {
          debug("cannot find whereis callback")
        }
        break;

      case (MessageType.TEST):
        debug("TEST input");
        break;

      default:
        debug(`received data ${input.toString('utf8').replace('\n', '')}`);
        break;
    }
  }

  setupConnection(peerId, stream) {
    let id = peerId.toB58String();
    debug(`setupConnection with ${id}`);
    this._node.connectionManager.setPeerValue(peerId, 1);
    const p = pushable();
    this._nodeTable[id] = p;

    // this is a two in one pipe
    // we are sending from p to stream
    // and receving from stream to the last function
    pipe(p, map(JSON.stringify), lp.encode(), stream, lp.decode(), map(JSON.parse),
      async (source) => {
        try {
          for await (const x of source) {
            console.log("recevied form alice", x);
            this.inputHandler(id, x, peerId);
          }
        } catch (err) {
          debug(`try catch of the source`)
          processExpectedNetworkErrors(err, "setupConnection/pipe");
        }

        debug(`deleting entry for  ${id}`);
        await this._node.hangUp(peerId); // hanging up; will it cause an exception?? 
        delete this._nodeTable[id];
        this.reissueUnacknowledged(id)
      }
    )
  }
  
  nPeers(_this) {
    console.log(_this._node.metrics)
    return _this._node.metrics.peers.length
  }

  async getPeerInfo(id) {
    debug(`getting peer info of ${id}`);
    const peerId = PeerId.createFromB58String(id);
    debug(`peer id: ${peerId}`);
    let _this = this;
    let nPeers = this.nPeers;
    let n_attempts = 0;
    async function try_find_peer() {
      if (_this._node.peerStore.has(peerId)) {
        debug("peer info is in the store");
        return _this._node.peerStore.get(peerId);
      }
      else {
        try {
          debug(`calling peerRouting.findPeer ${peerId}`);
          const peerInfo = await _this._node.peerRouting.findPeer(peerId, { timeout: 1000 });
          debug("findPeer returned");
          return peerInfo;
        } catch (err) {
          //debug(`getPeerInfo error: ${err}`);
          debug(`try_find_peer exception`);
          if (nPeers(_this) > 0) {
            n_attempts++;
          }

          if (err instanceof AggregateError) {
            for (let e of err) {
              debug(`Find peer error with code: ${e}, ${e.code}`);
            }
          } else {
            debug(`Find peer error: ${err.toString()}`)
            throw err;
          }

          if (n_attempts > 5) {
            debug(`Resolving to empty peer info`)
            return new PeerInfo(peerId);
            // reject (err);
          } else {
            debug(`try_find_peer: attempt ${n_attempts} failed with ${nPeers(_this)} nodes connected`)
            // addPending (try_find_peer);
            setTimeout(try_find_peer, 500)
          }
        }
      }
    }

    return await try_find_peer();
  }

  async getPeerInfoWithRelay(id) {
    let pi = null;
    try {
      //pi = await this.getPeerInfo(id);
      pi = this.getPeerInfoWithoutRouting(id);
      debug(`getPeerInforWithRelay: pi is ${pi}`)
      debug(`getPeerInforWithRelay: with relay_id ${this._relay_id}`)
      if (this._relay_id) {
        pi.multiaddrs.add(multiaddr(`/p2p/${_relay_id}/p2p-circuit/p2p/${id}`))
      }
    } catch (err) {
      debug(`getPeerInforWithRelay: Do something about this err: ${err}`);
      throw err;
    }


    // for (let i = 0; i < p2pconfig.relays.length; i++  ) {
    //     pi.multiaddrs.add( multiaddr(`${p2pconfig.relays[i]}/p2p-circuit/p2p/${id}`))
    // }
    return pi
  }

  async dial(id) {
    let i = 0;
    let timeout = 2000;
    let _this = this;
    async function iterate() {
      try {
        const peerInfo = await _this.getPeerInfoWithRelay(id);
        // lav en ingen relay først
        //const peerInfo = await _this.getPeerInfoWithoutRouting(id);
        //const peerInfo = await _this.dialing();
        debug("find peer succeeded");
        debug(`dialing will use the following addresses:`)
        peerInfo.multiaddrs.forEach(m => { debug(m.toString()) });
        debug(">> -- end of address list -- << ")
        debug(`trying to dial, attempt number ${i}`)
        //const { stream } = await _this._node.dialProtocol(peerInfo, _PROTOCOL);
        const { stream } = await _this._node.dialProtocol(peerInfo, _PROTOCOL);
        debug("dial successful")
        _this.setupConnection(peerInfo.id, stream);
        return stream;
      } catch (err) {
        console.error(err);
        processExpectedNetworkErrors(err, "dial");
        // if the error is suppressed we move on to trying 10 times
        // with exponential backoff
        // 2020-02-10; AA: TODO: this code has a hardcoded constant 
        if (i <= 10) {
          debug(`dial failed, we retry in ${timeout} seconds`)
          setTimeout(iterate, timeout);
          i++;
          timeout *= 2
        } else {
          debug(`we are giving up on dialing`)
          throw err;
        }
      }
    }
    
    return await iterate();
  } 

  
  async push_wrap(id, data) {
    while (true) {
      try {
        debug(`push_wrap`)

        if (!this._nodeTable[id]) {
          debug(`no stream cached for ${id}; redialing}`);
          await this.dial(id);
        } else {
          debug(`cached stream is available; we reuse it`);
        }

        let p = this._nodeTable[id];

        debug(`push_wrap; stream obtained`);
        await p.push(data);
        debug(`push_wrap; data pushed into the stream`);
        break;
      } catch (err) {
        // the stream we have used is 
        // no good for whatever reason; 
        // most likely there are networking 
        // issues. we report the errors
        // and redial
        debug(`push wrap error`)
        processExpectedNetworkErrors(err, "push_wrap");
      }
    }
  }

  async sendp2p(id, procId, obj) {
    this.push_wrap(id, {
      messageType: MessageType.SEND,
      pid: procId,
      message: obj
    });
  }

  async spawnp2p(id, data) {
    const spawnNonce = uuidv4();
    let _this = this;
    return new Promise((resolve, reject) => {
      _this._spawnNonces[spawnNonce] = (err, data) => {
        if (err) { 
          reject(err) 
        } else { 
          resolve(data) 
        }
      };
      _this.push_wrap(id, {
        messageType: MessageType.SPAWN,
        spawnNonce: spawnNonce,
        message: data
      })
    });
  }

  async whereisp2p(id, str) {

    let whereisNonce = uuidv4();
    let _this = this;

    async function f() {
      debug("pushing whereis message");
      _this.push_wrap(id, {
        messageType: MessageType.WHEREIS,
        whereisNonce: whereisNonce,
        message: str
      });
    }
    this.addUnacknowledged(id, whereisNonce, f);
    this._whereisNonces[whereisNonce] = (err, data) => {
      if (err) {
        throw err;
      } else {
        _this.removeUnacknowledged(id, whereisNonce);
        return data;
      }
    }
    return await f();
  }
  

  async tryPending() {
    if (__networkPending.length > 0) {
      let n = __networkPending.length;
      debug(`####### Connect trigger: try Pending. There are ${n} pending commands`);
      for (let i = 0; i < n; i++) {
        // debug (`discovery trigger ${key}`)
        let t = __networkPending.shift();
        t();
      }
    }
  }

  async startNode() {
    debug(`Starting p2p node ${this._peerInfo.id.toB58String()}`)

    this._node = await new Node({ peerInfo: this._peerInfo });
    // have to use below in the future
    // this._node = new Libp2p(
    //   { peerInfo: this._peerInfo}
    // );
    debug("Node created")

    const webrtcAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star'
    this._node.peerInfo.multiaddrs.add(webrtcAddr)

    this._node.on('peer:discovery', (peer) => {
      debug(`discovered: ${peer.id.toB58String()}`);
      //log(`Found peer ${peer.id.toB58String()}`);
    });

    this._node.on('error', (err) => {
      error(`Error in p2p: ${err}`);
    })

    this._node.on('peer:connect', (peerInfo) => {
      debug(`try connecting with ${peerInfo.id.toB58String()}`);
      this.tryPending();
      //debug(`++ connect: ${peerInfo.id.toB58String()}  ${nPeers()}`);
      debug(`++ connect: ${peerInfo.id.toB58String()}`);
      //log(`Connected to ${peerInfo.id.toB58String()}`);
    })

    this._node.on('peer:disconnect', (peerInfo) => {
      let id = peerInfo.id.toB58String();
      debug(`-- disconnect: ${id}`);
      //log(`Disconnected from ${id}`);

      
      if (this._nodeTable[id]) {
        debug(`deleting node table entry for ${id}`)
        delete this._nodeTable[id]
      }
      /* 
      if (this._relayTable[id]) {
        debug(`deleting relay table entry`)
        delete this._relayTable[id]
      }
      */
    })

    await this._node.handle(_PROTOCOL, async ({ connection, stream }) => {
      this.setupConnection(connection.remotePeer, stream)
    })

    await this._node.start();
    debug("p2p node started");
    //status.innerText = 'node started!';
    term.write(`Node started with id ${this._node.peerInfo.id.toB58String()}\n`);
    term.promptWrite('')
    //stream test
    // let stream = await this.dialing();
    // await sendMessage("hallooo!", stream);
    

    return;
  }

}



async function obtainPeerId(nodeIdJSON) {
  const peerId = await PeerId.createFromJSON(nodeIdJSON);
  const peerInfo = new PeerInfo(peerId);
  return peerInfo;
}

async function startp2p(nodeIdJSON, rt) {
  let peerInfo = await obtainPeerId(nodeIdJSON);
  debug("Peer info created/loaded");
  let _troupeP2P = new TroupeP2P(rt, peerInfo);
  console.log(_troupeP2P);
  //setupBlockingHealthChecker(_HEALTHCHECKPERIOD);
  await _troupeP2P.startNode();

  if (rt) {
    rt.networkReady(peerInfo.id.toB58String());
  }

  return _troupeP2P;
}

function processExpectedNetworkErrors (err, source="source unknown") {    
  debug (`error source: ${source}`);
  if (err instanceof AggregateError) {
    for (const e of err ) {        
      processExpectedNetworkErrors(e, source)
    }
  } else {
    if (err.code) {
      switch (err.code) {
        case 'ENETUNREACH':
          error (`${err.toString()}`)
          break;
        case 'ENOTFOUND':
          error (`${err.toString()}`)
          break;
        case 'ECONNRESET':
          error (`${err.toString()}`)
          break;
        case 'ERR_TRANSPORT_DIAL_FAILED':
          error (`${err.toString()}`)
          break;
        case 'ABORT_ERR':
          error (`${err.toString()}`)
          break;
        case 'ECONNREFUSED':
          error ((`${err.toString()}`))
          break;
        case 'ERR_HOP_REQUEST_FAILED':
          error ((`${err.toString()}`))
          break;
        case 'ERR_NO_DIAL_MULTIADDRS':
          error ((`${err.toString()}`))
          break;
        case 'ERR_ENCRYPTION_FAILED':
          error ((`${err.toString()}`))
          break;
        case 'ERR_NO_VALID_ADDRESSES':
          error ((`${err.toString()}`))
          break;  
        case 'ERR_MPLEX_STREAM_RESET':
          error ((`${err.toString()}`))
          break;  

        default:
          error (`Unhandled error case with error code ${err.code}`)
          throw err;
      }    
    } else {
         error (`Unhandled general error case ${err}`)
         throw err;
    }
  }    
}

export { startp2p, processExpectedNetworkErrors }