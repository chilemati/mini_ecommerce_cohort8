// import needed packages and modules
const express = require("express");
const { router } = require("./routes/productRoutes");
const conn = require("./utils/connectDb");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
let origin = ["http://localhost:3000"];
const path = require("path");

// middleware
app.use(cors({ credentials: true, origin }));
app.use(express.json()); // accept json files from front-end
app.use(express.urlencoded({ extended: true })); // accept form-data from front-end ui
app.use("/api/ecommerce", router);

// routes

// start server

//>>>>>>>> DEPLOYMENT >>>>>>>>>>>>>>>>>
app.use(express.static(path.join(__dirname, "/client/build")));

//>>>>>>>>> SERVE REACT INDEX.HTML EACH TIME THERE IS A GET REQUEST >>>>>>>>>>>>>>

app.get("*", (req, res) => {
	res.send(path.join(__dirname, "/client/build", "index.html"));
});

conn(() => {
	app.listen(process.env.PORT || 4000, () => {
		console.log(`Listening to request on Port ${process.env.PORT}`);
	});
});

// console.log(sumTwo(5, 9));
// console.log(timesTwo(5, 7));
