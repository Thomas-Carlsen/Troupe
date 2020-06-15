'use strict'

import libp2p from 'libp2p' // no .d.ts type declaration file with npm - which is true for all below
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'
import Boostrap from 'libp2p-bootstrap'

// used for peer routing
import KadDHT from 'libp2p-kad-dht';

const defaultsDeep = require('@nodeutils/defaults-deep')

export function Node(_options) {
  return libp2p.create(defaultsDeep(_options, {
    modules: {
      transport: [Websockets, WebRTCStar],
      connEncryption: [Secio],
      streamMuxer: [Mplex],
      peerDiscovery: [Boostrap],
      dht: KadDHT
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
      relay:{
        enabled: true,
        hop :  { enabled: false, active:false }
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

