const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function conn(cb) {
	try {
		let db = await mongoose.connect(process.env.MONGODB_URL); //this is a promise
		// console.log(db);
		console.log("Connection to Db was successful!");
		if (db.STATES.connected === 1) {
			cb(); // app.listen in our app.js
		} else {
			console.log("Connection to Db was not successful!");
		}
	} catch (err) {
		console.log(err.message);
	}
}

module.exports = conn;
