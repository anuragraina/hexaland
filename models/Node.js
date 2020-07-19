const mongoose = require('mongoose');

//schema of individual node
const nodeSchema = new mongoose.Schema({
	name                  : {
		type     : String,
		required : true,
		trim     : true
	},
	friends               : {
		type : Map,
		of   : String
	},
	friendsConnectingEdge : {
		type : Map,
		of   : String
	},
	clusterID             : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'Node'
	}
});

//function to check validity
nodeSchema.statics.checkValidity = async ({ node1, edge1, node2, edge2 }) => {
	const foundNode1 = await Node.findOne({ name: node1 });
	const foundNode2 = await Node.findOne({ name: node2 });
	const edge1Str = edge1.toString();
	const edge2Str = edge2.toString();

	//checking the range
	if (edge1 < 0 || edge1 > 5 || edge2 < 0 || edge2 > 5) {
		throw 'Edges values should be between 0 and 5!!!';
	}
	// checking already in same cluster or not
	if (foundNode1 !== null && foundNode2 !== null) {
		const id1 = mongoose.Types.ObjectId(foundNode1.clusterID);
		const id2 = mongoose.Types.ObjectId(foundNode2.clusterID);
		if (id1.equals(id2)) {
			throw `Both ${node1} and ${node2} are in the same cluster!!!`;
		}
	}
	// checking availability of that side of node1
	if (foundNode1 !== null) {
		if (foundNode1.friends.get(edge1Str)) {
			throw `${node1} already connected at ${edge1}`;
		}
	}
	// checking availability of side of node2
	if (foundNode2 !== null) {
		if (foundNode2.friends.get(edge2Str)) {
			throw `${node2} already connected at ${edge2}`;
		}
	}
};

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
