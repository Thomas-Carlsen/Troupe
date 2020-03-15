'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var libp2p_1 = __importDefault(require("libp2p")); // no .d.ts type declaration file with npm - which is true for all below
var libp2p_websockets_1 = __importDefault(require("libp2p-websockets"));
var libp2p_webrtc_star_1 = __importDefault(require("libp2p-webrtc-star"));
var libp2p_secio_1 = __importDefault(require("libp2p-secio"));
var libp2p_mplex_1 = __importDefault(require("libp2p-mplex"));
var libp2p_bootstrap_1 = __importDefault(require("libp2p-bootstrap"));
// used for peer routing
var libp2p_kad_dht_1 = __importDefault(require("libp2p-kad-dht"));
var defaultsDeep = require('@nodeutils/defaults-deep');
function Node(_options) {
    return libp2p_1.default.create(defaultsDeep(_options, {
        modules: {
            transport: [libp2p_websockets_1.default, libp2p_webrtc_star_1.default],
            connEncryption: [libp2p_secio_1.default],
            streamMuxer: [libp2p_mplex_1.default],
            peerDiscovery: [libp2p_bootstrap_1.default],
            dht: libp2p_kad_dht_1.default
        },
        config: {
            peerDiscovery: {
                bootstrap: {
                    enabled: true,
                    list: [
                        '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                        '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                        '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                        '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                        '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                        '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
                        //relay
                        "/dns4/troupe-lbs-primary.askarov.net/tcp/5555/p2p/QmUjm46PZGcN7KwkjzcsTFpccWZTAVKijLEgCS9XBKzAoD"
                    ]
                }
            },
            relay: {
                enabled: true,
                hop: { enabled: false, active: false }
            }
        },
        metrics: {
            enabled: true
        },
        dht: {
            enabled: true
        }
    }));
}
exports.Node = Node;
