const Node = require('../models/Node');
const iterate = require('../functions/iterate');

async function yo(node1, edge1, node2, edge2, arr) {
	let connectionsTobeAdded = [];
	let presentNodeName = node1;
	let presentNodeEdge = edge1;
	let newNodeName = node2;
	let newNodeEdge = edge2;

	for (const ele of arr) {
		connectionsTobeAdded.push({
			name    : presentNodeName,
			edge    : presentNodeEdge,
			newEdge : newNodeEdge
		});

		let newNodeNextEdge = (newNodeEdge + 1 + 6) % 6;
		newNodeNextEdge = newNodeNextEdge.toString();
		let presentNode = await Node.findOne({ name: presentNodeName });
		let presentNodeNextEdge = (presentNodeEdge - 1 + 6) % 6;
		presentNodeNextEdge = presentNodeNextEdge.toString();
		let nextNodeName = presentNode.neighbours.get(presentNodeNextEdge);
		if (nextNodeName) {
			let nextNodeEdge = presentNode.neighboursConnectingEdge.get(nextNodeName);
			nextNodeEdge = parseInt(nextNodeEdge);
			let nextNodeNextEdge = (nextNodeEdge - 1 + 6) % 6;
			newNodeEdge = parseInt(newNodeNextEdge);
			presentNodeName = nextNodeName;
			presentNodeEdge = nextNodeNextEdge;
		} else {
			break;
		}
	}

	iterate(connectionsTobeAdded, newNodeName);
}

module.exports = yo;
