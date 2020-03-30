"use strict";
import axios from 'axios';
import { mkLogger } from './logger.js';
//import {mkRuntime, startRuntime} from './runtimeMonitored.js'


const logger = mkLogger("Term");


let term_options = {
    convertEol: true,
    cursorBlink: true,
    fontSize: 16,
    fontWeight: '700',
    theme: {
        foreground: '#4E9A05',
        background: '#000b00',
        cursor: '#4E9A05'
    }
}

// This is from the xterm-ansi-bundle.js file
let term;


let term_prompt = "troupe-webcli> ";
let line_buffer = [];
let cursor_pos = 0;
let eol = 0;
let cmd_hist = [];


function handlePrintable(c) {
    term.write(c);

    // Save cursor pos
    term.write('\x1b[s');
    line_buffer.splice(cursor_pos, 0, c);
    cursor_pos++;
    eol++;
    // Delete right
    term.write('\x1b[K');
    // Fill right
    for (var i = cursor_pos; i < line_buffer.length; i++)
        term.write(line_buffer[i]);
    // Restore cursor pos
    term.write('\x1b[u');
}


function deleteAtCursor() {
    // Save cursor pos
    term.write('\x1b[s');
    // Delete right
    term.write('\x1b[K');
    // Fill right
    for (var i = cursor_pos; i < line_buffer.length; i++)
        term.write(line_buffer[i]);
    // Restore cursor pos
    term.write('\x1b[u');
}

async function runTroupe(args) {
    console.log("Running Troupe");

    logger.debug(`Requiring runtimeMonitored.js`);
    const runt = require('./runtimeMonitored.js');
    logger.debug(`Required runtimeMonitored.js`);

    // fake object to test program
    let rt = {};
    rt.rt_uuid = 2;
    rt.linkLibs = (a, b, c) => { return a; };
    rt.ret = (a) => { term.write("\n" + a); };
    rt.mkValPos = (a, b) => { return a; };




    // check if args[0] exists somehow and make a if condition
    /*
    const file = await import(args[0]);
    let Top = file.Top;
    let top = new Top(rt);
    top.main()
    */

    /*
    let response = await fetch("http://localhost:1234/programs/prog_42_commonjs.js");
    

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        console.log(response);
        window.rr = response;
        console.log( await response.text())
        let file = response.body;
        console.log(file);
    } else {
        alert("HTTP-Error: " + response.status);
    }
    */

    //let runningFile = "prog_42_commonjs.js";
    //let file = require('./programs/' + runningFile);
    
    //let file = require('./programs/fib.js');
    let file = require('./programs/out/out.js');
    let top = new file(runt.mkRuntime());
    runt.startRuntime(top);
    

    /*
    // importing the compiled program file
    await import(args[0])
        .then(module => {
            let Top = module.Top;
            // let top = new Top(runtime.runtime);
            // //top.main();
            // runtime.start(top);
        })
        .catch(err => {
            term.write("\nFile '" + args[0] + "' do not exists");
            console.error(err);
        });
    */

    /*
    if (progs[file] != undefined) {
 
        let res = new progs[file](rt);
        res.main();
 
        /*
        let top =  new progs[file](runtime);
        start(top);
    } else {
        term.write("\nFile '" + file + "' do not exists");
    }*/

}

async function p2pTest() {
    console.log("Running p2p test");

}

// why is this not just a string?
function helpOptions() {
    let out = `Run one of the following commands:
        troupe <program>
        p2p
        ls
        help\n`;
    return out;
}

async function handleCommand(line_str) {
    if (line_str.trim() == "") return;
    let line = line_buffer.join('').trim().split(' ');
    let command = line[0];
    switch (command) {
        case "help":
            term.write(helpOptions());
            break;
        case "troupe":
            await runTroupe(line.splice(1));
            break;
        case "p2p":
            await p2pTest();
            break;
        case "compile":
            const runt = require('./runtimeMonitored.js');
            let rt = {};
            rt.rt_uuid = 2;
            rt.linkLibs = (a, b, c) => { return a; };
            rt.ret = (a) => { term.write("\n" + a); };
            rt.mkValPos = (a, b) => { return a; };

            //console.log("calling server");
            try {
                let compiledFile = await axios.get('http://localhost:3000/compile');
                console.log("received from server");
                //console.log(compiledFile);

                let Top = Function("rt", "let Top = " + compiledFile.data + "; return new Top(rt);");
                // console.log(Top)
                // let top = Top(rt);
                // console.log(top);
                let top = Top(runt.mkRuntime());
                console.log(top);
                await runt.startRuntime(top);


            } catch(e) {
                //console.log("Trouble with receving a compiled file from the server");
                console.log(e.response.data);
                //console.log(e);
            }
            //console.log("Compiled session over");

            /*
            let Top = Function("rt", compiledFile.data);
            console.log(Top);
            let top = new Top(rt);
            console.log(top);
            

            let Top = Function("rt", compiledFile.data);
            //let Top = txt.data;
            console.log(Top);
            console.log("running rt")
            let p = new Top(rt);
            console.log(p);

            let rt = await runt.mkRuntime();
            let top = new Top(rt);
            console.log(top);
            await runt.startRuntime(top);
            */

            break;
        default:
            term.write("Do not recognise command '" + command + "'. Type 'help' to see options\n");
    }
}


async function handleNonprintable(code, key) {
    switch (code) {

        // Enter
        case 13:
            term.write('\n');
            let line_str = line_buffer.join('');
            cmd_hist.push(line_str);
            await handleCommand(line_str);
            term.write(term_prompt);
            cursor_pos = 0;
            eol = 0;
            line_buffer = [];
            break;

        // End
        case 35:
            term.write('\x1b[' + (eol - cursor_pos) + 'C');
            cursor_pos = eol;
            break;

        // Home 
        case 36:
            term.write('\x1b[' + cursor_pos + 'D');
            cursor_pos = 0;
            break;


        // Left arrow
        case 37:
            if (cursor_pos > 0) {
                term.write(key);
                cursor_pos--;
            }
            break;

        // Right arrow
        case 39:
            if (cursor_pos < eol) {
                term.write(key);
                cursor_pos++;
            }
            break;

        // Backspace
        case 8:
            if (cursor_pos > 0) {
                cursor_pos--;
                eol--;
                line_buffer.splice(cursor_pos, 1);

                // Backspace in terminal
                term.write('\b \b');

                deleteAtCursor();
            }
            break;

        // Delete
        case 46:
            if (cursor_pos < eol) {
                eol--;
                line_buffer.splice(cursor_pos, 1);

                deleteAtCursor();
            }
            break;

        // Up arrow
        case 38:
            break;

        // Down arrow
        case 40:
            break;


        // Tab
        case 9:
            //let auto_cor_str = "troupe ./programs/prog_42_es6.js";
            let auto_cor_str = "troupe ./programs/prog_42_commonjs.js";
            term.write(auto_cor_str);
            line_buffer = line_buffer.concat(auto_cor_str.split(""));
            cursor_pos += auto_cor_str.length;
            eol += auto_cor_str.length;
            break;

        default:
    }
}

async function handleInput(key, e) {
    //console.log("KeyCode:" + e.keyCode + ", CharCode: " + e.charCode);
    await e.charCode != 0 ? handlePrintable(key) : handleNonprintable(e.keyCode, key);
};


function startTerminal() {
    term = new xterm.Terminal(term_options);
    term.on('key', (key, e) => {
        handleInput(key, e);
    })
    
    term.open(document.getElementById('div'));
    term.fit();
    window.addEventListener('resize', function () { term.fit(); });
    
    term.promptWrite = (mess) => {
        term.write(term_prompt + mess);
    }
    term.write("\nTerm is ready!\n");
    term.promptWrite('');
} 



export { term, startTerminal };