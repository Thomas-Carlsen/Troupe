'use strict';

import { writeFileSync } from 'fs';

import { argv as args } from 'yargs';

let outfile = args.outfile
if (!outfile) {
    console.log ("outfile option required");
    process.exit(1)
}


import { create } from "peer-id";

create((err,id) => {
    const obj = id.toJSON();
    console.log("Created key with id:", obj.id);

    const s = JSON.stringify(obj);
    writeFileSync (outfile, s, 'utf8');
})

