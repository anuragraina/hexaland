import React from 'react';
import './App.css';

import DisplayCluster from './components/DisplayCluster';
import AddHotspot from './components/AddHotspot';

function App() {
	return (
		<div className="App">
			<h1 className="heading">Hexaland</h1>
			<AddHotspot />
			<DisplayCluster />
		</div>
	);
}

export default App;
