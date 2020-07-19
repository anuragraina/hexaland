import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HexGrid, Layout, Hexagon, Text } from 'react-hexgrid';
import './App.css';

const getCoordinates = (x, y, idx) => {
	switch (idx) {
		case 0:
			return [ x, y - 1 ];
		case 1:
			return [ x + 1, y - 1 ];
		case 2:
			return [ x + 1, y ];
		case 3:
			return [ x, y + 1 ];
		case 4:
			return [ x - 1, y + 1 ];
		case 5:
			return [ x - 1, y ];
		default:
			return [ x, y ];
	}
};

function App() {
	//const [ nodes, setNodes ] = useState([]);
	const [ cluster, setCluster ] = useState({});

	useEffect(() => {
		axios.get('/api/hexaland').then((response) => {
			const clusterData = Object.values(response.data);
			let center = [ '', -1 ];

			const getNode = (nodeName) => {
				for (const node of clusterData) {
					if (node.name === nodeName) {
						return node;
					}
				}
			};

			for (const node of clusterData) {
				const name = node.name;
				const neighboursCount = Object.keys(node.neighbours).length;

				if (neighboursCount > center[1]) {
					center = [ name, neighboursCount ];
				}
			}

			const coordinates = {
				[center[0]]: [ 0, 0 ]
			};

			const queue = [ center[0] ];
			const visitedNodes = [ center[0] ];

			while (queue.length !== 0) {
				const nodeName = queue.shift();
				const neighbours = Object.entries(getNode(nodeName).neighbours);
				const [ baseX, baseY ] = coordinates[nodeName];

				neighbours.forEach((neighbour) => {
					if (!neighbour || visitedNodes.includes(neighbour[1])) {
						return;
					}

					visitedNodes.push(neighbour[1]);
					coordinates[neighbour[1]] = getCoordinates(baseX, baseY, parseInt(neighbour[0]));
					queue.push(neighbour[1]);
				});
			}

			console.log(coordinates);
			setCluster(coordinates);
		});
	}, []);

	return (
		<div className="App">
			<HexGrid viewBox="-50 -50 100 100">
				{/* Grid with manually inserted hexagons */}
				<Layout size={{ x: 4, y: 4 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
					{Object.keys(cluster).map((node) => {
						const [ x, y ] = cluster[node];
						return (
							<Hexagon key={node} q={x} r={y} s={0} onClick={null}>
								<Text>{node}</Text>
							</Hexagon>
						);
					})}
				</Layout>
			</HexGrid>
		</div>
	);
}

export default App;
