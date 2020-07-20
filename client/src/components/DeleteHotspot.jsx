import React from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function DeleteHotspot(props) {
	const handleDelete = () => {
		axios
			.delete(`/api/hexaland/${props.node}`)
			.then((response) => {
				console.log(response);
				window.location.reload(true);
			})
			.catch((error) => {
				alert('Cannot delete Node!!!');
				console.log(error);
			});
	};

	return (
		<Modal isOpen={props.modal} toggle={props.toggle}>
			<ModalHeader toggle={props.toggle}>Delete Hotspot</ModalHeader>
			<ModalBody>Are you sure you want to delete "{props.node}"?</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={handleDelete}>
					Yes, Delete
				</Button>{' '}
				<Button color="secondary" onClick={props.toggle}>
					Cancel
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default DeleteHotspot;
