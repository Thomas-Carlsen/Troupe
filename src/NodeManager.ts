import {mkLogger} from './logger.js'
const logger = mkLogger("NodeManager");


class Node {
    nodeId;
    constructor(nodeId) {
        this.nodeId = nodeId;     
    }
}

class NodeManager {   
    localNode;
    levels;
    aliases;
    constructor(levels, aliases) {
        logger.debug(`Created new NodeManager with levels ${levels} and aliases ${aliases}`)
        this.localNode = null;
        this.levels = levels;
        this.aliases = aliases
    }

    setLocalHostPort(h)  {
        logger.debug(`setLocalHostPort: Sets localNode to be a new Node with nodeId ${h}`)
        if (this.localNode != null) {
            logger.error("local port already set. quitting...");
            //process.exit(1);
        }
        this.localNode = new Node(h);
    }

    getNodeId () {
        this.localNode.nodeId
    }

    getNode(nodeName) {
        if (nodeName.startsWith("@")) {
            nodeName = this.aliases[nodeName.substring(1)];
        }
        // TODO: error handling in case aliases are not available; 2020-01-31
        
        return new Node (nodeName);        
    }

    isLocalNode (id) {
        if (this.localNode == undefined) {
            logger.error("local node undefined; should not happen")
            //process.exit(1);
        }
        return this.localNode.nodeId == id
    }

    // Another hack; 2018-03-10; aa
    getLocalNode() {
        if (this.localNode == undefined) {
            logger.error("local node undefined; should not happen")
            //process.exit(1);
        }
        return this.localNode;
    }
}

export {NodeManager};