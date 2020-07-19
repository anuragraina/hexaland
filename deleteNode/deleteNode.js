const Node = require('../models/Node');

// to iterate and update the cluster name of all the nodes in arr
async function deleteNode(name, arr) {
	for (const [ val, key ] of arr) {
		const foundNode = await Node.findOne({ name: val });
		foundNode.friends.delete(key);
		foundNode.friendsConnectingEdge.delete(name);
		await foundNode.save();
	}
	return await Node.deleteOne({ name });
}

module.exports = deleteNode;
