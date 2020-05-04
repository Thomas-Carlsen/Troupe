"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger("Term");
var term_options = {
    convertEol: true,
    cursorBlink: true,
    fontSize: 16,
    fontWeight: '700',
    theme: {
        foreground: '#4E9A05',
        background: '#000b00',
        cursor: '#4E9A05'
    }
};
// This is from the xterm-ansi-bundle.js file
var term;
exports.term = term;
var term_prompt = ""; //"\u001b[32m" + "troupe-webcli> \u001b[37m";
var line_buffer = [];
var cursor_pos = 0;
var eol = 0;
var cmd_hist = [];
var n = cmd_hist.length;
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
    return __awaiter(this, void 0, void 0, function () {
        var runt, file, top;
        return __generator(this, function (_a) {
            console.log("Running Troupe");
            logger.debug("Requiring runtimeMonitored.js");
            runt = require('./runtimeMonitored.js');
            logger.debug("Required runtimeMonitored.js");
            file = require('./programs/out/out.js');
            top = new file(runt.mkRuntime());
            runt.startRuntime(top);
            return [2 /*return*/];
        });
    });
}
function p2pTest() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Running p2p test");
            return [2 /*return*/];
        });
    });
}
function helpOptions() {
    var out = "Run one of the following commands:\n        troupe <program>\n        p2p\n        ls\n        help\n";
    return out;
}
function showHist() {
    var str = "";
    for (var _i = 0, cmd_hist_1 = cmd_hist; _i < cmd_hist_1.length; _i++) {
        var word = cmd_hist_1[_i];
        str += word + "\n";
    }
    term.write(str);
}
function compileAndExecute() {
    return __awaiter(this, void 0, void 0, function () {
        var runt, compiledFile, Top, top_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        runt = require('./runtimeMonitored.js');
                    }
                    catch (e) {
                        console.log("Xterm compile error: error in require runtime");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get('http://localhost:3000/compile')];
                case 2:
                    compiledFile = _a.sent();
                    Top = Function("rt", "let Top = " + compiledFile.data + "; return new Top(rt);");
                    top_1 = Top(runt.mkRuntime());
                    return [4 /*yield*/, runt.startRuntime(top_1)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    logger.error("XTERM: " + e_1.response.data);
                    console.log(e_1.response.data);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleCommand(line_str) {
    return __awaiter(this, void 0, void 0, function () {
        var line, command, _a, thirdpartyjscode, e_2, newWindow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (line_str.trim() == "")
                        return [2 /*return*/];
                    line = line_buffer.join('').trim().split(' ');
                    command = line[0];
                    _a = command;
                    switch (_a) {
                        case "help": return [3 /*break*/, 1];
                        case "troupe": return [3 /*break*/, 2];
                        case "p2p": return [3 /*break*/, 4];
                        case "hist": return [3 /*break*/, 6];
                        case "jsAtt": return [3 /*break*/, 7];
                        case "execute": return [3 /*break*/, 11];
                        case "compile": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 13];
                case 1:
                    term.write(helpOptions());
                    return [3 /*break*/, 14];
                case 2: return [4 /*yield*/, runTroupe(line.splice(1))];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 4: return [4 /*yield*/, p2pTest()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 6:
                    showHist();
                    return [3 /*break*/, 14];
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, axios_1.default.get('http://localhost:6660/jsAttack')];
                case 8:
                    thirdpartyjscode = _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _b.sent();
                    console.log(e_2.response.data);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 14];
                case 11:
                    newWindow = window.open();
                    newWindow.document.write("ohai");
                    _b.label = 12;
                case 12:
                    compileAndExecute();
                    return [3 /*break*/, 14];
                case 13:
                    term.write("Do not recognise command '" + command + "'. Type 'help' to see options\n");
                    _b.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    });
}
function handleNonprintable(code, key) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, line_str, idx, line_str_1, last_cmd, idx, next_cmd, _, line_str_2, last_cmd, idx, next_cmd, _;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = code;
                    switch (_a) {
                        case 13: return [3 /*break*/, 1];
                        case 35: return [3 /*break*/, 3];
                        case 36: return [3 /*break*/, 4];
                        case 37: return [3 /*break*/, 5];
                        case 39: return [3 /*break*/, 6];
                        case 8: return [3 /*break*/, 7];
                        case 46: return [3 /*break*/, 8];
                        case 38: return [3 /*break*/, 9];
                        case 40: return [3 /*break*/, 10];
                        case 9: return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    term.write('\n');
                    line_str = line_buffer.join('');
                    // add cmd to cmd_hist
                    if (cmd_hist[cmd_hist.length - 1] != line_str && line_str != "") {
                        if (cmd_hist.includes(line_str)) {
                            idx = cmd_hist.indexOf(line_str);
                            cmd_hist.splice(idx, 1);
                        }
                        cmd_hist.push(line_str);
                    }
                    return [4 /*yield*/, handleCommand(line_str)];
                case 2:
                    _b.sent();
                    term.write(term_prompt);
                    cursor_pos = 0;
                    eol = 0;
                    line_buffer = [];
                    return [3 /*break*/, 12];
                case 3:
                    term.write('\x1b[' + (eol - cursor_pos) + 'C');
                    cursor_pos = eol;
                    return [3 /*break*/, 12];
                case 4:
                    term.write('\x1b[' + cursor_pos + 'D');
                    cursor_pos = 0;
                    return [3 /*break*/, 12];
                case 5:
                    if (cursor_pos > 0) {
                        term.write(key);
                        cursor_pos--;
                    }
                    return [3 /*break*/, 12];
                case 6:
                    if (cursor_pos < eol) {
                        term.write(key);
                        cursor_pos++;
                    }
                    return [3 /*break*/, 12];
                case 7:
                    if (cursor_pos > 0) {
                        cursor_pos--;
                        eol--;
                        line_buffer.splice(cursor_pos, 1);
                        // Backspace in terminal
                        term.write('\b \b');
                        deleteAtCursor();
                    }
                    return [3 /*break*/, 12];
                case 8:
                    if (cursor_pos < eol) {
                        eol--;
                        line_buffer.splice(cursor_pos, 1);
                        deleteAtCursor();
                    }
                    return [3 /*break*/, 12];
                case 9:
                    n = cmd_hist.length;
                    if (n != 0) {
                        line_str_1 = line_buffer.join('');
                        if (line_str_1 == "" || !cmd_hist.includes(line_str_1)) {
                            last_cmd = cmd_hist[n - 1];
                            writeStr(last_cmd);
                        }
                        else if (cmd_hist.indexOf(line_str_1) != 0) {
                            idx = cmd_hist.indexOf(line_str_1);
                            next_cmd = cmd_hist[idx - 1];
                            //clear line
                            for (_ in line_str_1) {
                                term.write('\b \b'); // backspace 
                            }
                            line_buffer = [];
                            eol = 0;
                            cursor_pos = 0;
                            writeStr(next_cmd);
                        }
                    }
                    return [3 /*break*/, 12];
                case 10:
                    n = cmd_hist.length;
                    if (n != 0) {
                        line_str_2 = line_buffer.join('');
                        if (line_str_2 == "" || !cmd_hist.includes(line_str_2)) {
                            last_cmd = cmd_hist[0];
                            writeStr(last_cmd);
                        }
                        else if (cmd_hist.indexOf(line_str_2) != n - 1) {
                            idx = cmd_hist.indexOf(line_str_2);
                            next_cmd = cmd_hist[idx + 1];
                            //clear line
                            for (_ in line_str_2)
                                term.write('\b \b'); // backspace 
                            line_buffer = [];
                            eol = 0;
                            cursor_pos = 0;
                            writeStr(next_cmd);
                        }
                    }
                    return [3 /*break*/, 12];
                case 11:
                    //let auto_cor_str = "troupe ./programs/prog_42_es6.js";
                    writeStr("troupe ./programs/prog_42_commonjs.js");
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function writeStr(str) {
    term.write(str);
    line_buffer = line_buffer.concat(str.split(""));
    cursor_pos += str.length;
    eol += str.length;
}
function handleInput(key, e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //console.log("KeyCode:" + e.keyCode + ", CharCode: " + e.charCode);
                return [4 /*yield*/, e.charCode];
                case 1:
                    //console.log("KeyCode:" + e.keyCode + ", CharCode: " + e.charCode);
                    (_a.sent()) != 0 ? handlePrintable(key) : handleNonprintable(e.keyCode, key);
                    return [2 /*return*/];
            }
        });
    });
}
;
function startTerminal() {
    exports.term = term = new xterm.Terminal(term_options);
    term.on('key', function (key, e) {
        handleInput(key, e);
    });
    term.open(document.getElementById('div'));
    term.fit();
    window.addEventListener('resize', function () { term.fit(); });
    term.promptWrite = function (mess) {
        term.write(term_prompt + mess);
    };
    term.write("\nTerm is ready!\n");
    term.promptWrite('');
}
exports.startTerminal = startTerminal;
