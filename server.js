const express = require('express'),
	morgan = require('morgan'),
	hexalandRoute = require('./routes/hexaland'),
	path = require('path');

const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.json({ extended: false }));

app.use('/api', hexalandRoute);

app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function (_, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'), function (err) {
		res.status(500).send(err);
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on PORT ${PORT}`);
});
