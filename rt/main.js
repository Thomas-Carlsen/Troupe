import { Top as prog_42} from "./programs/prog_42_es6.js";
//import { runtime, start } from "./built/runtimeMonitored";

const progs = {
    "prog_42.js": prog_42
} 

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

let term = new xterm.Terminal(term_options);

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

function runTroupe(args) {

    // fake object to test program
    let rt = {};
    rt.rt_uuid = 2; 
    rt.linkLibs = (a, b, c) => {return a;};
    rt.ret = (a) => {term.write("\n" + a);};
    rt.mkValPos = (a, b) => {return a;};

    let file = args[0];
    if (progs[file] != undefined) {
        let res = new progs[file](rt);
        res.main();
        /*
        let top =  new progs[file](runtime);
        start(top);*/
    } else {
        term.write("\nFile '" + file + "' do not exists");
    }
    
}

function handleCommand() {
    let line = line_buffer.join('').trim().split(' ');
    let command = line[0];
    switch(command) {
        case "troupe": 
            runTroupe(line.splice(1))
            break;
        case "help": 
            term.write("\nRun one of the following commands: \n\ttroupe <program> \n\tls \n\thelp"); 
            break;
        default: 
            term.write("\nDo not recognise command '" + command + "'. Type 'help' to see options")
    }
}


function handleNonprintable(code, key) {
    switch (code) {

        // Enter
        case 13: 
        let line_str = line_buffer.join('');
        cmd_hist.push(line_str);
        if (line_str.trim() != "") handleCommand();
        term.write('\n' + term_prompt);
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
        let auto_cor_str = "troupe prog_42.js";
        term.write(auto_cor_str);
        line_buffer = line_buffer.concat(auto_cor_str.split(""));
        cursor_pos += auto_cor_str.length;
        eol += auto_cor_str.length;
        break;
        
        default:
    }
}

term.on('key', (key, e) => {
    //console.log("KeyCode:" + e.keyCode + ", CharCode: " + e.charCode);
    e.charCode != 0 ? handlePrintable(key) : handleNonprintable(e.keyCode, key);
})

term.open(document.getElementById('div'));
term.fit();
window.addEventListener('resize', function () { term.fit(); });

// start
term.write(term_prompt);