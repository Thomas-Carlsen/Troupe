'use strict'

const TCP = require('libp2p-tcp')
const MulticastDNS = require('libp2p-mdns')
const WS = require('libp2p-websockets')
const WebSocketStar = require('libp2p-websocket-star')
const Bootstrap = require('libp2p-bootstrap')
const KadDHT = require('libp2p-kad-dht')
const WebSocketStarMulti = require('libp2p-websocket-star-multi')

const Multiplex = require('libp2p-mplex')
// const SPDY = require('libp2p-spdy')
const SECIO = require('libp2p-secio')
const libp2p = require('libp2p')
const defaultsDeep = require('@nodeutils/defaults-deep')
const p2pconfig = require('./p2pconfig')

const bootstrapers = [
  
    '/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
    '/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
    '/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    '/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    '/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    '/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    '/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    '/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
    // '/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
    '/ip6/2604:a880:1:20::1f9:9001/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
    '/ip6/2604:a880:1:20::203:d001/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    '/ip6/2604:a880:0:1010::23:d001/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    '/ip6/2400:6180:0:d0::151:6001/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    '/ip6/2604:a880:800:10::4a:5001/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    '/ip6/2a03:b0c0:0:1010::23:1001/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    '/ip6/2a03:b0c0:1:d0::e7:1/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
    // '/ip6/2604:a880:1:20::1d9:6001/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
    '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
    '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
    '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
    '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
]

class Node extends libp2p {
  constructor (_options) {
    const wsstar = new WebSocketStar({id: _options.peerInfo.id})

    // const wsstar = new WebSocketStarMulti( {
    //   servers: p2pconfig.rendezvousServers,
    //   id: _options.peerInfo.id,
    //   ignore_no_online:false
    // })


    const defaults = {
      connectionManager: {
        maxPeers: 100,          // this allows us to keep the memory footprint low! 2019-03-12; AA
        minPeers: 80,
        pollInterval: 5000,    
        defaultPeerValue: 0.5    // we later set the peer value of Troupe nodes to 1.0
      },

      modules: {
        transport: [
          new TCP(),
          WS,
          wsstar
        ],
        streamMuxer: [          
          Multiplex          
        ],
        connEncryption: [
          SECIO
        ],
        peerDiscovery: [
          MulticastDNS,
          Bootstrap, 
          wsstar.discovery
        ],
        dht: KadDHT
      },
      config: {
        peerDiscovery: {
          mdns: {
            interval: 5*1000,
            enabled: true
          },
          bootstrap: {
            interval: 5*1000,
            list : bootstrapers,
            enabled: true
          },
          websocketStar: {
            enabled: true
          }
        },
        dht: {
          kBucketSize: 20,             
        },  
        EXPERIMENTAL: {
          dht: true, 
          pubsub: false
        }
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

export default Node
