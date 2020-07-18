const express = require('express'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'));

app.get('/', (req, res) => {
	res.send('Hi');
});

app.listen(PORT, () => {
	console.log(`Server listening on PORT ${PORT}`);
});
