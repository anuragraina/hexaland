const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Hexaland');
		console.log('MongoDB is connected!!!');
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = connectDB;
