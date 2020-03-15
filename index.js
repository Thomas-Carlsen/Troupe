import 'babel-polyfill'

const aliceIdJSON = require('./alice-id.json');
import {term, startTerminal} from './build/term.js';
import {startp2p} from './build/p2p/p2p.js';


// const startp2p = troupep2p.startp2p; //func?
// const spawnp2p = troupep2p.spawnp2p;
// const sendp2p = troupep2p.sendp2p;
// const whereisp2p = troupep2p.whereisp2p;
// const stopp2p = troupep2p.stopp2p;
// const processExpectedNetworkErrors = troupep2p.processExpectedNetworkErrors;

console.log("alice");


document.addEventListener('DOMContentLoaded', async () => {

  async function main() {

    startTerminal();


    let fakeRt = {
      "networkReady": (peerid) => { },

      "remoteSpawnOK": () => true,
      "spawnFromRemote": (mess, peerid) => {console.log(`spawnFromRemote\nmess: ${mess}\npeerid: ${peerid}`)},

      "receiveFromRemote": (pid, message, fromNodeId) => {
        console.log(`
          receiveFromRemote:
          pid: ${pid}
          message: ${message}
          fromNodeId: ${fromNodeId}`)
      },

      "whereisFromRemote": (mess) => {console.log(`whereisFromRemote:\nmess:${mess}`)}
    };

    // can be executed with 0, 1 or 2 arguments.
    // 1 arg: peerid
    // 2 arg: rt

    //let node = await startp2p(aliceIdJSON, fakeRt);

    
    /*
    try {
      let res = await node.whereisp2p("Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP", "this is a string mess");
      console.log(`res of whereisp2p: ${res}`)


      node.sendp2p("Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP", "", {"hej":"hej"});
    }
    catch (err) {
      console.error("main kaster: ", err)
    }
    */

    

  };

  main();

});
