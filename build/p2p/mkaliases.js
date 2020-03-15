/***
 * mkaliases.js
 *
 * A helper script for generating aliases from a set of given
 * files.
 *
 *
 * Author: Aslan Askarov, aslan@askarov.net
 *
 */
'use strict';
var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var files = argv['include'];
var outfile = argv['outfile'];
var aliases = {};
for (var i in files) {
    var fname = files[i];
    var json = JSON.parse(fs.readFileSync(fname));
    var alias = path.basename(fname, ".json");
    aliases[alias] = json.id;
}
fs.writeFileSync(outfile, JSON.stringify(aliases), 'utf8');
