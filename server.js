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

app.listen(PORT, () => {
	console.log(`Server listening on PORT ${PORT}`);
});
