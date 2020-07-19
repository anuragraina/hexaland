const Node = require('../models/Node');

//applying dfs technique to find all the nodes which are in that cluster
const dfs = async (name, notVisit) => {
	try {
		let s = [];
		let visited = new Set();
		s.push(name);
		visited.add(name);
		while (s.length > 0) {
			const t = s.pop();
			const foundNode = await Node.findOne({ name: t });
			foundNode.neighbours.forEach((val, key) => {
				if (val != notVisit && !visited.has(val)) {
					visited.add(val);
					s.push(val);
				}
			});
		}
		return new Promise((resolve, reject) => {
			resolve(visited);
		});
	} catch (e) {
		throw 'Error in dfs!!!';
	}
};

module.exports = dfs;
