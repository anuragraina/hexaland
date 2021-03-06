import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

function AddHotspot() {
	const [ modal, setModal ] = useState(false);
	const [ cluster, setCluster ] = useState([]);
	const [ availableEdges, setAvailableEdges ] = useState([]);
	const [ node1, setNode1 ] = useState('');
	const [ edge1, setEdge1 ] = useState('');
	const [ node2, setNode2 ] = useState('');
	const [ edge2, setEdge2 ] = useState('');

	//function to toggle modal display
	const toggle = () => setModal(!modal);

	//get node object by passing name
	const getNode = (nodeName) => {
		for (const node of cluster) {
			if (node.name === nodeName) {
				return node;
			}
		}
	};

	//check if the node with the given name exists
	const nodeExists = (nodeName) => {
		for (const node of cluster) {
			if (node.name === nodeName) {
				return true;
			}
		}

		return false;
	};

	//obtain cluster
	useEffect(() => {
		axios.get('/api/hexaland').then((response) => {
			const clusterData = Object.values(response.data);
			setCluster(clusterData);
		});
	}, []);

	//function to check the available edges for the node
	const handleNode1 = (event) => {
		if (event.target.value !== '--Select--') {
			let arr = [ 0, 1, 2, 3, 4, 5 ];
			setNode1(event.target.value);
			const node = getNode(event.target.value);

			for (const neighbour in node.neighbours) {
				arr = arr.filter((edge) => edge !== parseInt(neighbour));
			}

			setAvailableEdges(arr);
		}
	};

	//allot edge to new node
	const handleEdges = (event) => {
		if (event.target.value !== '--Select--') {
			const edge = parseInt(event.target.value);
			setEdge1(edge);

			edge < 3 ? setEdge2(edge + 3) : setEdge2(edge - 3);
		}
	};

	//post request sent to server after validating data
	const handleAddHotspot = () => {
		if (node1 === '' || edge1 === '' || node2 === '' || edge2 === '') {
			alert('Invalid response!!!');
		} else if (nodeExists(node2)) {
			alert(`${node2} already exists!!!`);
		} else {
			const newNodeData = {
				node1 : node1,
				edge1 : edge1,
				node2 : node2,
				edge2 : edge2
			};

			axios
				.post('/api/hexaland', newNodeData)
				.then((response) => {
					console.log(response);
					window.location.reload(true);
				})
				.catch((error) => {
					console.log(error);
				});

			console.log(newNodeData);
		}
	};

	return (
		<div>
			<Button color="danger" onClick={toggle} className="add-hotspot">
				Add Hotspot
			</Button>
			<Modal isOpen={modal} toggle={toggle} centered returnFocusAfterClose={false}>
				<ModalHeader toggle={toggle}>Add Hotspot</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label for="newNode" className="left-align">
								Enter the name of the new hotspot
							</Label>
							<Input
								required
								type="text"
								name="newNode"
								id="newNode"
								placeholder="New hotspot name"
								onChange={(event) => {
									setNode2(event.target.value);
								}}
								value={node2}
							/>
						</FormGroup>

						{/* check for empty data (initial case when database is empty) */}
						{cluster.length === 0 ? (
							<FormGroup>
								<Label for="newNode2" className="left-align">
									Enter the name of the 2nd hotspot
								</Label>
								<Input
									required
									type="text"
									name="newNode2"
									id="newNode2"
									placeholder="2nd hotspot name"
									onChange={(event) => {
										setNode1(event.target.value);
									}}
									value={node1}
								/>
							</FormGroup>
						) : (
							<FormGroup>
								<Label for="neighbour" className="left-align">
									Select the hotspot neighbour
								</Label>
								<Input type="select" name="neighbour" id="neighbour" onChange={handleNode1}>
									<option>--Select--</option>
									{cluster.map((node) => <option key={node.name}>{node.name}</option>)}
								</Input>
							</FormGroup>
						)}

						{cluster.length === 0 ? (
							<FormGroup>
								<Label for="neighbourEdge" className="left-align">
									Select the edge of the 2nd hotspot
								</Label>
								<Input type="select" name="neighbourEdge" id="neighbourEdge" onChange={handleEdges}>
									<option>--Select--</option>
									{[ ...Array(6) ].map((edge, index) => <option>{index}</option>)}
								</Input>
							</FormGroup>
						) : (
							<FormGroup>
								<Label for="neighbourEdge" className="left-align">
									Select the edge of the neighbour
								</Label>
								<Input type="select" name="neighbourEdge" id="neighbourEdge" onChange={handleEdges}>
									<option>--Select--</option>
									{availableEdges.map((edge) => <option>{edge}</option>)}
								</Input>
							</FormGroup>
						)}
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={handleAddHotspot}>
						Add Hotspot
					</Button>{' '}
					<Button color="secondary" onClick={toggle}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default AddHotspot;
