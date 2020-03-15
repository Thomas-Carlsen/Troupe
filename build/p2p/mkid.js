'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var args = require('yargs').argv;
var outfile = args.outfile;
if (!outfile) {
    console.log("Troupe p2p identifier generator");
    console.log("Usage: node $TROUPE/rt/bulit/p2p/mkid.js --outfile=FILENAME");
    process.exit(1);
}
var PeerId = require("peer-id");
PeerId.create(function (err, id) {
    var obj = id.toJSON();
    if (args.verbose) {
        console.log("Created key with id:", obj.id);
    }
    else {
        // console.log(obj.id);
    }
    var s = JSON.stringify(obj);
    fs.writeFileSync(outfile, s, 'utf8');
});
