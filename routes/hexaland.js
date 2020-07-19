const express = require('express');
const randstr = require('randomstring');
const Node = require('../models/Node');
const Cluster = require('../models/Cluster');
const dfs = require('../functions/dfs');
const deleteNode = require('../deleteNode/deleteNode');
const checkLeftside = require('../nodeCheck/leftside');
const checkRightside = require('../nodeCheck/rightside');

const router = express.Router();

//user giving input about connection between 2 hexagon grids
router.post('/hexaland', async (req, res) => {
	const node1 = req.body.node1;
	const edge1 = req.body.edge1;
	const node2 = req.body.node2;
	const edge2 = req.body.edge2;
	try {
		//function for checking validity of request
		await Node.checkValidity(req.body);

		const foundNode1 = await Node.findOne({ name: node1 });
		const foundNode2 = await Node.findOne({ name: node2 });
		const edge1Str = edge1.toString();
		const edge2Str = edge2.toString();

		//setting cluster name before joining 2 Nodes
		let cluster = '';
		if (foundNode1 === null && foundNode2 === null) {
			//intial case when both the grids are new
			const newCluster = new Cluster({
				name : randstr.generate()
			});
			await newCluster.save();
			cluster = newCluster._id;

			// creating new first node
			const newNode = new Node({
				name                     : node1,
				neighbours               : {},
				neighboursConnectingEdge : {},
				clusterID                : cluster
			});
			newNode.neighbours.set(edge1Str, node2);
			newNode.neighboursConnectingEdge.set(node2, edge2Str);
			await newNode.save();
		} else {
			// first node is already present
			cluster = foundNode1.clusterID;
		}

		//creating new hexagon second node
		if (foundNode2 == null) {
			const newNode = new Node({
				name                     : node2,
				neighbours               : {},
				neighboursConnectingEdge : {},
				clusterID                : cluster
			});
			newNode.neighbours.set(edge2Str, node1);
			newNode.neighboursConnectingEdge.set(node1, edge1Str);
			await newNode.save();
		}
		checkLeftside(node1, edge1, node2, edge2, [ 1, 2, 3, 4, 5, 6 ]);
		checkRightside(node1, edge1, node2, edge2, [ 1, 2, 3, 4, 5, 6 ]);
		res.status(200).json({
			success : true,
			message : 'Node added successfully...'
		});
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

//removing node from the cluster
router.delete('/hexaland/:name', async (req, res) => {
	const name = req.params.name;
	const foundNode = await Node.findOne({ name });

	if (foundNode === null) {
		res.redirect('/api/info');
	} else {
		const firstFriend = foundNode.neighboursConnectingEdge.keys().next().value;
		dfs(firstFriend, name)
			.then((response) => {
				foundNode.neighboursConnectingEdge.forEach((val, key) => {
					if (!response.has(key)) {
						throw 'Cannot remove node!!!';
					}
				});
				deleteNode(name, foundNode.neighboursConnectingEdge).then(() => {
					res.status(200).json({
						success : true,
						message : 'Node deleted successfully...'
					});
				});
			})
			.catch((err) => {
				res.status(400).send({ error: err });
			});
	}
});

// get information about a particular hexagon node
router.get('/hexaland', async (req, res) => {
	try {
		const foundNodes = await Node.find({});
		res.send(foundNodes);
	} catch (e) {
		res.status(400).send({ error: err });
	}
});

module.exports = router;
