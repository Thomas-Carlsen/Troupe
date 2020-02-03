let __terminal = null;
let __getcharCb = null;

class TigerExit extends Error {
  constructor(c) {
    super(c);
    super.code = c;
  }
}

class TigerIndexOutOfRange extends Error {}
class TigerNilLookup extends Error {
  constructor (pos) {
    super(); 
    this.pos = pos;
  }
}

let str_buffer = "";
let max_str_buffer_len = 256;

function print(_,s) {
  str_buffer = str_buffer.concat(s);
  if (str_buffer.length > max_str_buffer_len || s.endsWith('\n')) {
    flush();
  }
}

function flush(_) {
  __terminal.write ( str_buffer );
  str_buffer = "";
}

async function getChar (_) {
  flush();
  return new Promise (resolve => {
    if (__getcharCb == null) {
      __getcharCb = (x) => {
        __getcharCb = x;
        let res = __getcharCb.pop();
        if (__getcharCb.length == 0)
          __getcharCb = null;
        resolve (res);
      }
    } else {
      let res = __getcharCb.pop();
        if (__getcharCb.length == 0)
          __getcharCb = null;
        resolve (res);
    }
  })
}
function ord(_,s) { return s.length == 1 ? s.charCodeAt(0) : -1 }
function chr(_,i) { return String.fromCharCode(i) }
function size(_,s) { return s.length }
function substring(_,s,a,b) { return s.substring(a,a+b) }
function concat(_,s1,s2) { return s1.concat(s2) }
function not(_,i) { return i == 0 }
function exit(_,i) { throw new TigerExit(i) }


async function tigermain($sl){
  let $locals = {};
  $locals.$sl = $sl;
  return (0);
}

async function main () {
  
  try {
    let v = await tigermain ();
    flush();
    if (v == undefined)
      __terminal.write ("\ntiger-js> program exited with no value\n");
    else
      __terminal.write ("\ntiger-js> program exited with value '\x1b[32m" + v + "\x1b[0m'")
  } catch (e) {
    if (e instanceof TigerExit) {
      let ec = e.code;
      var col = "\x1b[32m";
      if (ec != 0)
        col = "\x1b[33m";
      __terminal.write ("\ntiger-js> program exited with code '" + col + ec + "\x1b[0m'")
    } else if (e instanceof TigerIndexOutOfRange) {
      __terminal.write ("\ntiger-js> program exited with exception '\x1b[31m" + "array index out of range" + "\x1b[0m'")
    } else if (e instanceof TigerNilLookup) {
      console.log (e.pos);
      __terminal.write ("\ntiger-js> program exited with exception '\x1b[31m" + "record field lookup applied to nil" + "\x1b[0m'")
      console.log (e.stack);
    } else {
      console.error(e);
    }
  }
}