const Node = require('../models/Node');

//to iterate and update the grids stored in arr
async function iterate(arr, name) {
	for (const ele of arr) {
		let edge = ele.edge.toString();
		let newEdge = ele.newEdge.toString();
		const ob = await Node.findOne({ name: ele.name });
		ob.friends.set(edge, name);
		ob.friendsConnectingEdge.set(name, newEdge);
		await ob.save();
		const ob1 = await Node.findOne({ name });
		ob1.friends.set(newEdge, ele.name);
		ob1.friendsConnectingEdge.set(ele.name, edge);
		await ob1.save();
	}
}

module.exports = iterate;
