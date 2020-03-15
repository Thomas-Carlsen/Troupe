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
//const assert = require('assert');
var axios_1 = __importDefault(require("axios"));
// GLOBALS
var compiler = null;
var rtObj = null;
var __unit;
var indentcounter = 0;
// accumulator of communication with the compiler; reset after
// each deserialization; needed because we have no guarantees about
// how the data coming back from the compiler is chunked
var accum = "";
//simple flag to make sure we handle one deserialization at a time
var processing = false;
var deserializationCallback = null;
var deserializationObject = null;
var trustLevel = null;
function setRuntimeObj(rt) {
    rtObj = rt;
    __unit = rt.__unit;
}
// -- utility functions ----------------------------
function isLVal(x) {
    return (typeof x.val != "undefined" &&
        typeof x.lev != "undefined" &&
        typeof x.tlev != "undefined");
}
function isClosure(x) {
    return (typeof x.env != "undefined"
        && typeof x.fun != "undefined"
        && typeof x.namespace != "undefined");
}
function isProcessId(x) {
    return (typeof x.pid != "undefined"
        && typeof x.node != "undefined"
        && typeof x.uuid != "undefined");
}
function isTuple(x) {
    return (typeof x.isTuple != "undefined");
}
function isList(x) {
    return (typeof x.isList != "undefined");
}
function isLevel(x) {
    return (typeof x.isLevel != "undefined");
}
function isAuthority(x) {
    return (typeof x.authorityLevel != "undefined");
}
function isAtom(x) {
    return (typeof x.atom != "undefined");
}
// --------------------------------------------------
// debugging mechanisms
function debuglog() {
    var s = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        s[_i] = arguments[_i];
    }
    var spaces = "";
    for (var j = 0; j < indentcounter; j++) {
        spaces = "  " + spaces;
    }
    s.unshift("DEBUG:" + spaces);
    console.log.apply(null, s);
}
function indent() {
    indentcounter++;
}
function unindent() {
    indentcounter--;
}
function deserializationError() {
    console.log("DESERIALIZATION ERROR HANDLING IS NOT IMPLEMENTED");
    process.exit(1);
}
function compilerOutputReady(data) {
    // debuglog (deserializationObject)
    processing = false;
    var serobj = deserializationObject;
    var desercb = deserializationCallback;
    // 1. reconstruct the namespaces
    var snippets = data.split("\n\n");
    var k = 0;
    for (var i = 0; i < serobj.namespaces.length; i++) {
        var ns = serobj.namespaces[i];
        var nsFun = "";
        nsFun += "this.libSet = new Set () \n";
        nsFun += "this.libs = [] \n";
        nsFun += "this.addLib = function (lib, decl) { if (!this.libSet.has (lib +'.'+decl)) { this.libSet.add (lib +'.'+decl); this.libs.push ({lib:lib, decl:decl})} } \n";
        nsFun += "this.loadlibs = function (cb) { rt.linkLibs (this.libs, this, cb) } \n";
        for (var j = 0; j < ns.length; j++) {
            if (j > 0) {
                nsFun += "\n\n"; // looks neater this way
            }
            var snippetJson = JSON.parse(snippets[k++]);
            // console.log (snippetJson.libs);
            // console.log (snippetJson.fname);
            nsFun += snippetJson.code;
        }
        var NS = new Function('rt', nsFun);
        // console.log (NS.toString());
        ns.fun = new NS(rtObj);
    }
    // 2. reconstruct the closures and environments
    var closures = serobj.closures;
    var envs = serobj.envs;
    function mkClosure(i) {
        if (closures[i].obj) {
            return closures[i].obj;
        }
        else {
            var nm = serobj.namespaces[closures[i].namespacePtr.NamespaceID].fun;
            var fn = nm[closures[i].fun];
            closures[i].obj = new rtObj.Closure({}, nm, fn);
            closures[i].obj.env = mkEnv(closures[i].envptr.EnvID);
            return closures[i].obj;
        }
    }
    function mkEnv(i) {
        if (envs[i].obj) {
            return envs[i].obj;
        }
        else {
            var env = {};
            envs[i].obj = env;
            for (var field in envs[i]) {
                if (field != "obj") { // needed, because otherwise we include the newly created `obj` field;
                    // which leads to a circular dependency down the road at stringification...
                    // 2018-03-05; AA
                    env[field] = mkValue(envs[i][field]);
                }
            }
            return envs[i].obj;
        }
    }
    function levRepToLevel(lev) {
        return rtObj.levels.mkLevel(lev);
    }
    /*
                   #     #
     #    # #    # #     #   ##   #      #    # ######
     ##  ## #   #  #     #  #  #  #      #    # #
     # ## # ####   #     # #    # #      #    # #####
     #    # #  #    #   #  ###### #      #    # #
     #    # #   #    # #   #    # #      #    # #
     #    # #    #    #    #    # ######  ####  ######
                                                       
    */
    function mkValue(arg) {
        // console.log("*** mkValue", arg);
        //assert(isLVal(arg));
        var obj = arg.val;
        var lev = levRepToLevel(arg.lev);
        var tlev = levRepToLevel(arg.tlev);
        function _trustGLB(x) {
            return (rtObj.glb(x, trustLevel));
        }
        if (Array.isArray(obj)) {
            var a = [];
            for (var i = 0; i < obj.length; i++) {
                a.push(mkValue(obj[i]));
            }
            var marker = void 0;
            // console.log (arg.tupleKind);
            if (arg.tupleKind && arg.tupleKind == true) {
                marker = rtObj.mkTuple;
            }
            else {
                // console.log ("LIST")
                marker = rtObj.mkList;
            }
            return new rtObj.LVal(marker(a), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (typeof obj.ClosureID != "undefined") {
            return new rtObj.LVal(mkClosure(obj.ClosureID), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (typeof obj.envptr != "undefined") {
            return new rtObj.LVal(mkEnv(typeof obj.envptr.EnvID), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (Number.isInteger(obj) || (typeof (obj) === 'boolean') || typeof (obj) === 'string') {
            return new rtObj.LVal(obj, _trustGLB(lev), _trustGLB(tlev));
        }
        else if (isProcessId(obj)) {
            return new rtObj.LVal(new rtObj.ProcessID(obj.uuid, obj.pid, obj.node), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (isAuthority(obj)) {
            // 2018-10-18: AA: authority attenuation based on the trust level of the sender 
            return new rtObj.LVal(new rtObj.Authority(_trustGLB(levRepToLevel(obj.authorityLevel))), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (isLevel(obj)) {
            return new rtObj.LVal(levRepToLevel(obj.lev), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (isLVal(obj)) {
            return new rtObj.LVal(mkValue(obj), _trustGLB(lev), _trustGLB(tlev));
        }
        else if (isAtom(obj)) {
            var a = new rtObj.Atom(obj.atom, obj.creation_uuid);
            var v_1 = new rtObj.LVal(a, _trustGLB(lev), _trustGLB(tlev));
            return v_1;
        }
        else if (Object.keys(obj).length == 0) {
            return new rtObj.LVal(rtObj.__unitbase, _trustGLB(lev), _trustGLB(tlev));
        }
        else {
            return new rtObj.LVal(obj, _trustGLB(lev), _trustGLB(tlev));
            // aa; 2018-03-04; we should in principle have an exhaustive list of values here and
            // do not have such a default
        }
    }
    for (var i = 0; i < closures.length; i++) {
        mkClosure(i);
    }
    for (var i = 0; i < envs.length; i++) {
        mkEnv(i);
    }
    var v = mkValue(serobj.value);
    // go over the namespaces we have generated
    // and load all libraries before calling the last callback
    function loadLib(i, cb) {
        if (i < serobj.namespaces.length) {
            serobj.namespaces[i].fun.loadlibs(function () { return loadLib(i + 1, cb); });
        }
        else {
            cb();
        }
    }
    loadLib(0, function () { return desercb(v); });
}
// 2018-11-30: AA: TODO: implement a proper deserialization queue instead of 
// the coarse-grained piggybacking on the event loop
function deserialize(lev, jsonObj, cb) {
    if (processing) {
        setImmediate(deserialize, lev, jsonObj, cb); // postpone; 2018-03-04;aa
    }
    else {
        processing = true; // prevent parallel deserialization attempts; important! -- leads to nasty 
        // race conditions otherwise; 2018-11-30; AA
        trustLevel = lev;
        deserializationCallback = cb; // obs: this is a global for this module; 
        // the access to it should be carefully controlled
        // we need to share this object with the callbacks
        // perhaps reset callbacks?
        // console.log("* s deserialize", jsonObj);
        var serializedObj = jsonObj;
        // console.log (serializedObj);
        deserializationObject = serializedObj; // obs: another global that we must be careful with
        if (serializedObj.namespaces.length > 0) {
            for (var i = 0; i < serializedObj.namespaces.length; i++) {
                var ns = serializedObj.namespaces[i];
                for (var j = 0; j < ns.length; j++) {
                    // console.log("*s deserialize", ns[j]);
                    compiler.stdin.write(ns[j][1]);
                    compiler.stdin.write("\n");
                    // debuglog ("data out")
                }
            }
            compiler.stdin.write("!ECHO /*-----*/\n");
        }
        else {
            // shortcutting the unnecessary interaction with the compiler
            // 2018-09-20: AA
            compilerOutputReady("");
        }
    }
}
function deserializeAsync(lev, jsonObj) {
    return new Promise(function (resolve, reject) {
        deserialize(lev, jsonObj, function (body) {
            resolve(body);
        });
    });
}
function stopCompiler() {
    console.log("serialize: stopCompiler");
    //todo: make this call on the api server side
    //compiler.stdin.end();
}
/*
..######..########.########..####....###....##.......####.########....###....########.####..#######..##....##
.##....##.##.......##.....##..##....##.##...##........##.......##....##.##......##.....##..##.....##.###...##
.##.......##.......##.....##..##...##...##..##........##......##....##...##.....##.....##..##.....##.####..##
..######..######...########...##..##.....##.##........##.....##....##.....##....##.....##..##.....##.##.##.##
.......##.##.......##...##....##..#########.##........##....##.....#########....##.....##..##.....##.##..####
.##....##.##.......##....##...##..##.....##.##........##...##......##.....##....##.....##..##.....##.##...###
..######..########.##.....##.####.##.....##.########.####.########.##.....##....##....####..#######..##....##
*/
function serialize(x, pclev) {
    var seenNamespaces = new Map();
    var seenClosures = new Map();
    var seenEnvs = new Map();
    var namespaces = [];
    var closures = [];
    var envs = [];
    var level = pclev;
    function walk(lval) {
        // console.log("** walk", lval);
        //assert(isLVal(lval));
        level = rtObj.lub(level, lval.lev); // 2018-09-24: AA: is this the only place 
        // where we need to check the level of the message?
        var jsonObj;
        var x = lval.val;
        var tupleKind = false;
        if (isList(x) || isTuple(x)) {
            jsonObj = [];
            var i;
            for (i = 0; i < x.length; i++) {
                jsonObj.push(walk(x[i]));
            }
            if (isTuple(x)) {
                tupleKind = true;
                // console.log ("ISTUPLE")
            }
            else {
                // jsonObj.isList = true;
            }
        }
        else if (isClosure(x)) {
            if (seenClosures.has(x)) { // debuglog ("pointer to [existing] heap object", seen.get(x))
                jsonObj = { ClosureID: seenClosures.get(x) };
            }
            else {
                jsonObj = { ClosureID: closures.length };
                seenClosures.set(x, closures.length);
                var jsonClosure = {};
                closures.push(jsonClosure);
                var jsonEnvPtr = void 0;
                if (seenEnvs.has(x.env)) {
                    jsonEnvPtr = { EnvID: seenEnvs.get(x.env) };
                }
                else {
                    jsonEnvPtr = { EnvID: envs.length };
                    seenEnvs.set(x.eqnv, envs.length);
                    var jsonEnv = {};
                    envs.push(jsonEnv);
                    for (var field in x.env) {
                        if (field != "ret") {
                            var y = x.env[field];
                            jsonEnv[field] = walk(y);
                        }
                    }
                }
                jsonClosure.envptr = jsonEnvPtr;
                var _loop_1 = function (ff) {
                    if (x.namespace[ff] == x.fun) {
                        var jsonNamespacePtr = void 0;
                        var namespace_1;
                        if (seenNamespaces.has(x.namespace)) {
                            var n_id = seenNamespaces.get(x.namespace);
                            jsonNamespacePtr = { NamespaceID: n_id };
                            namespace_1 = namespaces[n_id];
                        }
                        else {
                            jsonNamespacePtr = { NamespaceID: namespaces.length };
                            seenNamespaces.set(x.namespace, namespaces.length);
                            namespace_1 = new Map();
                            namespaces.push(namespace_1);
                        }
                        namespace_1.set(ff, x.fun.serialized);
                        function dfs(deps) {
                            for (var _i = 0, deps_1 = deps; _i < deps_1.length; _i++) {
                                var depName = deps_1[_i];
                                if (!namespace_1.has(depName)) {
                                    namespace_1.set(depName, x.namespace[depName].serialized);
                                    dfs(x.namespace[depName].deps);
                                }
                            }
                        }
                        dfs(x.fun.deps);
                        jsonClosure.namespacePtr = jsonNamespacePtr;
                        jsonClosure.fun = ff;
                    }
                };
                for (var ff in x.namespace) {
                    _loop_1(ff);
                }
            }
            // } else if (isProcessId(x)) {
            //     console.log("XXX", x)
            //     jsonObj = new rtObj.ProcessID ( x.uuid, x.pid, x.node )
            //     // Object.setPrototypeOf(jsonObj, rtObj.ProcesSID);
        }
        else if (isLevel(x)) {
            jsonObj = { lev: x.stringRep(), isLevel: true };
        }
        else if (isLVal(x)) {
            jsonObj = walk(x);
        }
        else if (isAuthority(x)) {
            jsonObj = { authorityLevel: x.authorityLevel.stringRep() };
        }
        else if (isAtom(x)) {
            jsonObj = { atom: x.atom, creation_uuid: x.creation_uuid };
        }
        else {
            jsonObj = x;
        }
        // OBS: we are moving away from LVal representation
        // to a more explicit tuple that is different on purpose
        // from LVal. 2018-09-20: AA; We should ideally encapsulate
        // that in a different class with a name that reflects that 
        // this is a transport-level representation. 
        return { val: jsonObj, lev: lval.lev.stringRep(), tlev: lval.tlev.stringRep(), tupleKind: tupleKind };
        // return new rtObj.LVal(jsonObj, lval.lev.stringRep());
    }
    var value = walk(x);
    value.lev = rtObj.lub(x.lev, pclev).stringRep();
    var nsp = [];
    for (var j = 0; j < namespaces.length; j++) {
        nsp.push(Array.from(namespaces[j]));
    }
    var serializeObj = { libdeps: [],
        namespaces: nsp,
        closures: closures,
        envs: envs,
        value: value };
    // TODO: propagate the level; 
    return { data: serializeObj, level: level };
}
// I have to think about using the api a little better
function startCompiler(compiler_process) {
    //troupec compiler
    compiler = compiler_process;
    //todo: a lot of redesigning how the compiler is run on the api server
    /*
    compiler.on('exit', (code, signal) => {
      // console.error (code, signal);
      process.exit(code);
    });
    */
    // compiler.stdout.on('data', (data) => {
    //   let d = `${data}`
    //   accum += d;
    //   let marker = "/*-----*/\n\n"
    //   let j = accum.indexOf(marker);
    //   if (j >= 0) {
    //     compilerOutputReady (accum.slice(0,j));
    //     accum = accum.slice(j + marker.length);
    //   }
    // });
}
function serializeMain() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get('http://localhost:3000/serialize')];
                case 1:
                    response = _a.sent();
                    startCompiler(response.data);
                    return [2 /*return*/];
            }
        });
    });
}
// would like to call serializeMain from the first file who calls it
// might be rt
// START!
try {
    serializeMain();
}
catch (err) {
    console.error("serialize error", err);
}
exports.default = { serialize: serialize, deserialize: deserialize, deserializeAsync: deserializeAsync, stopCompiler: stopCompiler, setRuntimeObj: setRuntimeObj };
