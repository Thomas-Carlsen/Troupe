"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pid_equals(o1, o2) {
    var eq = o1.val.pid.toString() == o2.val.pid.toString();
    //console.log("pid eq", o1, o2, eq);
    return (eq);
}
function pid_val_equals(v1, v2) {
    var eq = v1.pid.toString() == v2.pid.toString();
    return eq;
}
var ProcessID = /** @class */ (function () {
    function ProcessID(rt_uuid, pid, node) {
        this.uuid = rt_uuid;
        this.pid = pid;
        this.node = node; // getLocalNode();
        this.stringRep = toString;
        this.equals = pid_equals;
        this.stringRep = this.toString;
    }
    ProcessID.prototype.toString = function () {
        var x = this.pid.toString();
        // console.log (x);
        return x;
    };
    return ProcessID;
}());
exports.default = { pid_equals: pid_equals, pid_val_equals: pid_val_equals, ProcessID: ProcessID };
