'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var logger_js_1 = require("./logger.js");
var logger = logger_js_1.mkLogger("NodeManager");
var Node = /** @class */ (function () {
    function Node(nodeId) {
        this.nodeId = nodeId;
    }
    return Node;
}());
var NodeManager = /** @class */ (function () {
    function NodeManager(levels, aliases) {
        this.localNode = null;
        this.levels = levels;
        this.aliases = aliases;
    }
    NodeManager.prototype.setLocalHostPort = function (h) {
        if (this.localNode != null) {
            logger.error("local port already set. quitting...");
            //process.exit(1);
        }
        this.localNode = new Node(h);
    };
    NodeManager.prototype.getNodeId = function () {
        this.localNode.nodeId;
    };
    NodeManager.prototype.getNode = function (nodeName) {
        if (nodeName.startsWith("@")) {
            nodeName = this.aliases[nodeName.substring(1)];
        }
        // TODO: error handling in case aliases are not available; 2020-01-31
        return new Node(nodeName);
    };
    NodeManager.prototype.isLocalNode = function (id) {
        if (this.localNode == undefined) {
            logger.error("local node undefined; should not happen");
            //process.exit(1);
        }
        return this.localNode.nodeId == id;
    };
    // Another hack; 2018-03-10; aa
    NodeManager.prototype.getLocalNode = function () {
        if (this.localNode == undefined) {
            logger.error("local node undefined; should not happen");
            //process.exit(1);
        }
        return this.localNode;
    };
    return NodeManager;
}());
exports.NodeManager = NodeManager;
