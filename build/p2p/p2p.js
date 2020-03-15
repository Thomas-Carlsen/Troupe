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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("babel-polyfill");
var libp2p_bundle_js_1 = require("./libp2p-bundle.js");
var PeerId = require('peer-id');
var PeerInfo = require('peer-info');
var pipe = require('it-pipe');
var pushable = require('./Pushable.js');
var AggregateError = require('aggregate-error');
var streaming_iterables_1 = require("streaming-iterables");
var lp = require('it-length-prefixed');
var logger_js_1 = require("../logger.js");
var uuidv4 = require('uuid/v4');
var term_js_1 = require("../term.js");
var logLevel = 'info'; //yargs.argv.debug?'debug':'info';
var logger = logger_js_1.mkLogger('p2p', logLevel);
var debug = function (x) { return logger.debug(x); };
var info = function (x) { return logger.info(x); };
var error = function (x) { return logger.error(x); };
var _PROTOCOL = "/troupe/1.0.0";
var __networkPending = [];
var MessageType = {
    SPAWN: 0,
    SPAWNOK: 1,
    SEND: 2,
    TEST: 3,
    WHEREIS: 4,
    WHEREISOK: 5
};
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
function sendMessage(mess, stream) {
    return __awaiter(this, void 0, void 0, function () {
        var p;
        return __generator(this, function (_a) {
            p = pushable();
            pipe(p, stream.sink);
            pipe(stream, function (source) {
                var source_1, source_1_1;
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function () {
                    var data, e_1_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 5, 6, 11]);
                                source_1 = __asyncValues(source);
                                _b.label = 1;
                            case 1: return [4 /*yield*/, source_1.next()];
                            case 2:
                                if (!(source_1_1 = _b.sent(), !source_1_1.done)) return [3 /*break*/, 4];
                                data = source_1_1.value;
                                console.log('received from liz:', data.toString());
                                _b.label = 3;
                            case 3: return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 11];
                            case 5:
                                e_1_1 = _b.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 11];
                            case 6:
                                _b.trys.push([6, , 9, 10]);
                                if (!(source_1_1 && !source_1_1.done && (_a = source_1.return))) return [3 /*break*/, 8];
                                return [4 /*yield*/, _a.call(source_1)];
                            case 7:
                                _b.sent();
                                _b.label = 8;
                            case 8: return [3 /*break*/, 10];
                            case 9:
                                if (e_1) throw e_1.error;
                                return [7 /*endfinally*/];
                            case 10: return [7 /*endfinally*/];
                            case 11: return [2 /*return*/];
                        }
                    });
                });
            });
            p.push(mess);
            return [2 /*return*/];
        });
    });
}
var TroupeP2P = /** @class */ (function () {
    function TroupeP2P(_rt, _peerInfo) {
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
        this._whereisNonces = {};
        this._relay_id = null;
        this._unacknowledged = {};
    }
    TroupeP2P.prototype.addUnacknowledged = function (id, uuid, f) {
        if (!this._unacknowledged[id]) {
            this._unacknowledged[id] = [];
        }
        this._unacknowledged[id][uuid] = f;
    };
    TroupeP2P.prototype.removeUnacknowledged = function (id, uuid) {
        delete this._unacknowledged[id][uuid];
    };
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
    TroupeP2P.prototype.getPeerInfoWithoutRouting = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var peerid, peerInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug("getPeerInfoWithoutRelay: with id " + id);
                        return [4 /*yield*/, PeerId.createFromB58String(id)];
                    case 1:
                        peerid = _a.sent();
                        debug("getPeerInfoWithoutRelay: with peerid " + peerid);
                        peerInfo = new PeerInfo(peerid);
                        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star');
                        debug("getPeerInfoWithoutRelay: with peerInfo " + peerInfo);
                        return [2 /*return*/, peerInfo];
                }
            });
        });
    };
    TroupeP2P.prototype.reissueUnacknowledged = function (id) {
        for (var uuid in _unacknowledged[id]) {
            setImmediate(_unacknowledged[id][uuid]);
        }
    };
    TroupeP2P.prototype.inputHandler = function (id, input, fromNodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, x, _cb, y, _cbw;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        debug("-- input handler");
                        _a = input.messageType;
                        switch (_a) {
                            case (MessageType.SPAWN): return [3 /*break*/, 1];
                            case (MessageType.SPAWNOK): return [3 /*break*/, 3];
                            case (MessageType.SEND): return [3 /*break*/, 4];
                            case (MessageType.WHEREIS): return [3 /*break*/, 5];
                            case (MessageType.WHEREISOK): return [3 /*break*/, 7];
                            case (MessageType.TEST): return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        if (!this._rt.remoteSpawnOK()) return [3 /*break*/, 3];
                        debug("RECEIVED SPAWN");
                        return [4 /*yield*/, this._rt.spawnFromRemote(input.message, fromNodeId)];
                    case 2:
                        x = _b.sent();
                        this.push_wrap(id, {
                            messageType: MessageType.SPAWNOK,
                            spawnNonce: input.spawnNonce,
                            message: x
                        });
                        return [3 /*break*/, 10];
                    case 3:
                        debug("SPAWN OK");
                        _cb = this._spawnNonces[input.spawnNonce];
                        if (_cb) {
                            delete this._spawnNonces[input.spawnNonce]; // cleanup
                            _cb(null, input.message); // null means no errors            
                        }
                        else {
                            // something is fishy;
                            debug("something is fishy; no matching callback for the nonce");
                        }
                        return [3 /*break*/, 10];
                    case 4:
                        debug("SEND  " + id);
                        this._rt.receiveFromRemote(input.pid, input.message, fromNodeId);
                        return [3 /*break*/, 10];
                    case 5:
                        debug("p2p whereis incoming request");
                        return [4 /*yield*/, this._rt.whereisFromRemote(input.message)];
                    case 6:
                        y = _b.sent();
                        this.push_wrap(id, {
                            messageType: MessageType.WHEREISOK,
                            whereisNonce: input.whereisNonce,
                            message: y
                        });
                        debug("p2p whereis replied");
                        return [3 /*break*/, 10];
                    case 7:
                        debug("WHEREIS OK");
                        _cbw = this._whereisNonces[input.whereisNonce];
                        if (_cbw) {
                            delete this._whereisNonces[input.whereisNonce];
                            _cbw(null, input.message);
                        }
                        else {
                            debug("cannot find whereis callback");
                        }
                        return [3 /*break*/, 10];
                    case 8:
                        debug("TEST input");
                        return [3 /*break*/, 10];
                    case 9:
                        debug("received data " + input.toString('utf8').replace('\n', ''));
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    TroupeP2P.prototype.setupConnection = function (peerId, stream) {
        var _this_1 = this;
        var id = peerId.toB58String();
        debug("setupConnection with " + id);
        this._node.connectionManager.setPeerValue(peerId, 1);
        var p = pushable();
        this._nodeTable[id] = p;
        // this is a two in one pipe
        // we are sending from p to stream
        // and receving from stream to the last function
        pipe(p, streaming_iterables_1.map(JSON.stringify), lp.encode(), stream, lp.decode(), streaming_iterables_1.map(JSON.parse), function (source) { var source_2, source_2_1; return __awaiter(_this_1, void 0, void 0, function () {
            var x, e_2_1, err_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        source_2 = __asyncValues(source);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, source_2.next()];
                    case 3:
                        if (!(source_2_1 = _b.sent(), !source_2_1.done)) return [3 /*break*/, 5];
                        x = source_2_1.value;
                        console.log("recevied form alice", x);
                        this.inputHandler(id, x, peerId);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(source_2_1 && !source_2_1.done && (_a = source_2.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(source_2)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        err_1 = _b.sent();
                        debug("try catch of the source");
                        processExpectedNetworkErrors(err_1, "setupConnection/pipe");
                        return [3 /*break*/, 14];
                    case 14:
                        debug("deleting entry for  " + id);
                        return [4 /*yield*/, this._node.hangUp(peerId)];
                    case 15:
                        _b.sent(); // hanging up; will it cause an exception?? 
                        delete this._nodeTable[id];
                        this.reissueUnacknowledged(id);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TroupeP2P.prototype.nPeers = function (_this) {
        console.log(_this._node.metrics);
        return _this._node.metrics.peers.length;
    };
    TroupeP2P.prototype.getPeerInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            function try_find_peer() {
                return __awaiter(this, void 0, void 0, function () {
                    var peerInfo, err_2, _i, err_3, e;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!_this._node.peerStore.has(peerId)) return [3 /*break*/, 1];
                                debug("peer info is in the store");
                                return [2 /*return*/, _this._node.peerStore.get(peerId)];
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                debug("calling peerRouting.findPeer " + peerId);
                                return [4 /*yield*/, _this._node.peerRouting.findPeer(peerId, { timeout: 1000 })];
                            case 2:
                                peerInfo = _a.sent();
                                debug("findPeer returned");
                                return [2 /*return*/, peerInfo];
                            case 3:
                                err_2 = _a.sent();
                                //debug(`getPeerInfo error: ${err}`);
                                debug("try_find_peer exception");
                                if (nPeers(_this) > 0) {
                                    n_attempts++;
                                }
                                if (err_2 instanceof AggregateError) {
                                    for (_i = 0, err_3 = err_2; _i < err_3.length; _i++) {
                                        e = err_3[_i];
                                        debug("Find peer error with code: " + e + ", " + e.code);
                                    }
                                }
                                else {
                                    debug("Find peer error: " + err_2.toString());
                                    throw err_2;
                                }
                                if (n_attempts > 5) {
                                    debug("Resolving to empty peer info");
                                    return [2 /*return*/, new PeerInfo(peerId)];
                                    // reject (err);
                                }
                                else {
                                    debug("try_find_peer: attempt " + n_attempts + " failed with " + nPeers(_this) + " nodes connected");
                                    // addPending (try_find_peer);
                                    setTimeout(try_find_peer, 500);
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var peerId, _this, nPeers, n_attempts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug("getting peer info of " + id);
                        peerId = PeerId.createFromB58String(id);
                        debug("peer id: " + peerId);
                        _this = this;
                        nPeers = this.nPeers;
                        n_attempts = 0;
                        return [4 /*yield*/, try_find_peer()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TroupeP2P.prototype.getPeerInfoWithRelay = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pi;
            return __generator(this, function (_a) {
                pi = null;
                try {
                    //pi = await this.getPeerInfo(id);
                    pi = this.getPeerInfoWithoutRouting(id);
                    debug("getPeerInforWithRelay: pi is " + pi);
                    debug("getPeerInforWithRelay: with relay_id " + this._relay_id);
                    if (this._relay_id) {
                        pi.multiaddrs.add(multiaddr("/p2p/" + _relay_id + "/p2p-circuit/p2p/" + id));
                    }
                }
                catch (err) {
                    debug("getPeerInforWithRelay: Do something about this err: " + err);
                    throw err;
                }
                // for (let i = 0; i < p2pconfig.relays.length; i++  ) {
                //     pi.multiaddrs.add( multiaddr(`${p2pconfig.relays[i]}/p2p-circuit/p2p/${id}`))
                // }
                return [2 /*return*/, pi];
            });
        });
    };
    TroupeP2P.prototype.dial = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            function iterate() {
                return __awaiter(this, void 0, void 0, function () {
                    var peerInfo, stream, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, _this.getPeerInfoWithRelay(id)];
                            case 1:
                                peerInfo = _a.sent();
                                // lav en ingen relay først
                                //const peerInfo = await _this.getPeerInfoWithoutRouting(id);
                                //const peerInfo = await _this.dialing();
                                debug("find peer succeeded");
                                debug("dialing will use the following addresses:");
                                peerInfo.multiaddrs.forEach(function (m) { debug(m.toString()); });
                                debug(">> -- end of address list -- << ");
                                debug("trying to dial, attempt number " + i);
                                return [4 /*yield*/, _this._node.dialProtocol(peerInfo, _PROTOCOL)];
                            case 2:
                                stream = (_a.sent()).stream;
                                debug("dial successful");
                                _this.setupConnection(peerInfo.id, stream);
                                return [2 /*return*/, stream];
                            case 3:
                                err_4 = _a.sent();
                                console.error(err_4);
                                processExpectedNetworkErrors(err_4, "dial");
                                // if the error is suppressed we move on to trying 10 times
                                // with exponential backoff
                                // 2020-02-10; AA: TODO: this code has a hardcoded constant 
                                if (i <= 10) {
                                    debug("dial failed, we retry in " + timeout + " seconds");
                                    setTimeout(iterate, timeout);
                                    i++;
                                    timeout *= 2;
                                }
                                else {
                                    debug("we are giving up on dialing");
                                    throw err_4;
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var i, timeout, _this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        timeout = 2000;
                        _this = this;
                        return [4 /*yield*/, iterate()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TroupeP2P.prototype.push_wrap = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var p, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        debug("push_wrap");
                        if (!!this._nodeTable[id]) return [3 /*break*/, 3];
                        debug("no stream cached for " + id + "; redialing}");
                        return [4 /*yield*/, this.dial(id)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        debug("cached stream is available; we reuse it");
                        _a.label = 4;
                    case 4:
                        p = this._nodeTable[id];
                        debug("push_wrap; stream obtained");
                        return [4 /*yield*/, p.push(data)];
                    case 5:
                        _a.sent();
                        debug("push_wrap; data pushed into the stream");
                        return [3 /*break*/, 8];
                    case 6:
                        err_5 = _a.sent();
                        // the stream we have used is 
                        // no good for whatever reason; 
                        // most likely there are networking 
                        // issues. we report the errors
                        // and redial
                        debug("push wrap error");
                        processExpectedNetworkErrors(err_5, "push_wrap");
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 0];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TroupeP2P.prototype.sendp2p = function (id, procId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.push_wrap(id, {
                    messageType: MessageType.SEND,
                    pid: procId,
                    message: obj
                });
                return [2 /*return*/];
            });
        });
    };
    TroupeP2P.prototype.spawnp2p = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var spawnNonce, _this;
            return __generator(this, function (_a) {
                spawnNonce = uuidv4();
                _this = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._spawnNonces[spawnNonce] = function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(data);
                            }
                        };
                        _this.push_wrap(id, {
                            messageType: MessageType.SPAWN,
                            spawnNonce: spawnNonce,
                            message: data
                        });
                    })];
            });
        });
    };
    TroupeP2P.prototype.whereisp2p = function (id, str) {
        return __awaiter(this, void 0, void 0, function () {
            function f() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        debug("pushing whereis message");
                        _this.push_wrap(id, {
                            messageType: MessageType.WHEREIS,
                            whereisNonce: whereisNonce,
                            message: str
                        });
                        return [2 /*return*/];
                    });
                });
            }
            var whereisNonce, _this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereisNonce = uuidv4();
                        _this = this;
                        this.addUnacknowledged(id, whereisNonce, f);
                        this._whereisNonces[whereisNonce] = function (err, data) {
                            if (err) {
                                throw err;
                            }
                            else {
                                _this.removeUnacknowledged(id, whereisNonce);
                                return data;
                            }
                        };
                        return [4 /*yield*/, f()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TroupeP2P.prototype.tryPending = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n, i, t;
            return __generator(this, function (_a) {
                if (__networkPending.length > 0) {
                    n = __networkPending.length;
                    debug("####### Connect trigger: try Pending. There are " + n + " pending commands");
                    for (i = 0; i < n; i++) {
                        t = __networkPending.shift();
                        t();
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    TroupeP2P.prototype.startNode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, webrtcAddr;
            var _this_1 = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        debug("Starting p2p node " + this._peerInfo.id.toB58String());
                        _a = this;
                        return [4 /*yield*/, new libp2p_bundle_js_1.Node({ peerInfo: this._peerInfo })];
                    case 1:
                        _a._node = _b.sent();
                        // have to use below in the future
                        // this._node = new Libp2p(
                        //   { peerInfo: this._peerInfo}
                        // );
                        debug("Node created");
                        webrtcAddr = '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star';
                        this._node.peerInfo.multiaddrs.add(webrtcAddr);
                        this._node.on('peer:discovery', function (peer) {
                            debug("discovered: " + peer.id.toB58String());
                            //log(`Found peer ${peer.id.toB58String()}`);
                        });
                        this._node.on('error', function (err) {
                            error("Error in p2p: " + err);
                        });
                        this._node.on('peer:connect', function (peerInfo) {
                            debug("try connecting with " + peerInfo.id.toB58String());
                            _this_1.tryPending();
                            //debug(`++ connect: ${peerInfo.id.toB58String()}  ${nPeers()}`);
                            debug("++ connect: " + peerInfo.id.toB58String());
                            //log(`Connected to ${peerInfo.id.toB58String()}`);
                        });
                        this._node.on('peer:disconnect', function (peerInfo) {
                            var id = peerInfo.id.toB58String();
                            debug("-- disconnect: " + id);
                            //log(`Disconnected from ${id}`);
                            if (_this_1._nodeTable[id]) {
                                debug("deleting node table entry for " + id);
                                delete _this_1._nodeTable[id];
                            }
                            /*
                            if (this._relayTable[id]) {
                              debug(`deleting relay table entry`)
                              delete this._relayTable[id]
                            }
                            */
                        });
                        return [4 /*yield*/, this._node.handle(_PROTOCOL, function (_a) {
                                var connection = _a.connection, stream = _a.stream;
                                return __awaiter(_this_1, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        this.setupConnection(connection.remotePeer, stream);
                                        return [2 /*return*/];
                                    });
                                });
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this._node.start()];
                    case 3:
                        _b.sent();
                        debug("p2p node started");
                        //status.innerText = 'node started!';
                        term_js_1.term.write("Node started with id " + this._node.peerInfo.id.toB58String() + "\n");
                        term_js_1.term.promptWrite('');
                        //stream test
                        // let stream = await this.dialing();
                        // await sendMessage("hallooo!", stream);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TroupeP2P;
}());
function obtainPeerId(nodeIdJSON) {
    return __awaiter(this, void 0, void 0, function () {
        var peerId, peerInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PeerId.createFromJSON(nodeIdJSON)];
                case 1:
                    peerId = _a.sent();
                    peerInfo = new PeerInfo(peerId);
                    return [2 /*return*/, peerInfo];
            }
        });
    });
}
function startp2p(nodeIdJSON, rt) {
    return __awaiter(this, void 0, void 0, function () {
        var peerInfo, _troupeP2P;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, obtainPeerId(nodeIdJSON)];
                case 1:
                    peerInfo = _a.sent();
                    debug("Peer info created/loaded");
                    _troupeP2P = new TroupeP2P(rt, peerInfo);
                    console.log(_troupeP2P);
                    //setupBlockingHealthChecker(_HEALTHCHECKPERIOD);
                    return [4 /*yield*/, _troupeP2P.startNode()];
                case 2:
                    //setupBlockingHealthChecker(_HEALTHCHECKPERIOD);
                    _a.sent();
                    if (rt) {
                        rt.networkReady(peerInfo.id.toB58String());
                    }
                    return [2 /*return*/, _troupeP2P];
            }
        });
    });
}
exports.startp2p = startp2p;
function processExpectedNetworkErrors(err, source) {
    if (source === void 0) { source = "source unknown"; }
    debug("error source: " + source);
    if (err instanceof AggregateError) {
        for (var _i = 0, err_6 = err; _i < err_6.length; _i++) {
            var e = err_6[_i];
            processExpectedNetworkErrors(e, source);
        }
    }
    else {
        if (err.code) {
            switch (err.code) {
                case 'ENETUNREACH':
                    error("" + err.toString());
                    break;
                case 'ENOTFOUND':
                    error("" + err.toString());
                    break;
                case 'ECONNRESET':
                    error("" + err.toString());
                    break;
                case 'ERR_TRANSPORT_DIAL_FAILED':
                    error("" + err.toString());
                    break;
                case 'ABORT_ERR':
                    error("" + err.toString());
                    break;
                case 'ECONNREFUSED':
                    error(("" + err.toString()));
                    break;
                case 'ERR_HOP_REQUEST_FAILED':
                    error(("" + err.toString()));
                    break;
                case 'ERR_NO_DIAL_MULTIADDRS':
                    error(("" + err.toString()));
                    break;
                case 'ERR_ENCRYPTION_FAILED':
                    error(("" + err.toString()));
                    break;
                case 'ERR_NO_VALID_ADDRESSES':
                    error(("" + err.toString()));
                    break;
                case 'ERR_MPLEX_STREAM_RESET':
                    error(("" + err.toString()));
                    break;
                default:
                    error("Unhandled error case with error code " + err.code);
                    throw err;
            }
        }
        else {
            error("Unhandled general error case " + err);
            throw err;
        }
    }
}
exports.processExpectedNetworkErrors = processExpectedNetworkErrors;
