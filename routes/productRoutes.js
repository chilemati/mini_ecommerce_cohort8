const express = require("express");
const { Product } = require("../model/prodModel");
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");
let router = express.Router();

router.get("/", (req, res) => {
	// res.json({ allProduct: "all Product" });
	Product.find()
		.then((ans) => {
			res.json(ans);
		})
		.catch((err) => {
			res.json(err.message);
		});
});
router.post("/createproduct", upload.single("prodImg"), async (req, res) => {
	/*
	STEPS TO CREATE A PRODUCT:
	> upload the image to cloudinary
	> extract the public_url and public_id from cloudinary success response
	> add public_url and public_id to meet ProductSchema requirement
	> save to mongodb and send a json response
	*/
	// > upload the image to cloudinary
	let result = await cloudinary.uploader.upload(req.file.path, {
		folder: "New_cohort8_product",
	});
	// console.log(result);
	// res.json(result);

	// > extract the public_url and public_id from cloudinary success response

	let prodImg_id = result.public_id;
	let prodImg_url = result.secure_url;
	let { prodName, prodPrice, prodSnippet, prodDetails } = req.body;

	// > add public_url and public_id to meet ProductSchema requirement
	let toDb = {
		prodDetails,
		prodName,
		prodPrice,
		prodSnippet,
		prodImg_id,
		prodImg_url,
	};

	// > save to mongodb and send a json response
	let db = new Product(toDb);
	db.save()
		.then((ans) => {
			res.json(ans);
		})
		.catch((err) => {
			res.json(err.message);
		});
	// if (req.file) {
	// 	console.log("This request has a file");
	// 	console.log(req.file);
	// 	console.log(req.body);
	// } else {
	// 	console.log("This request does not have a file");
	// }
	// res.json({ create: "new product created" });
});
router.post("/deleteProduct", async (req, res) => {
	// res.json({ delete: "product deleted" });
	let { id } = req.body;
	try {
		// get product to delete
		let toDel = await Product.findById(id);
		// remove from cloudinary
		let remImg = await cloudinary.uploader.destroy(toDel.prodImg_id);
		// now delete from db
		Product.findByIdAndDelete(id)
			.then((ans) => {
				res.json(ans);
			})
			.catch((err) => {
				res.json(err.message);
			});
	} catch (err) {
		next(err);
	}
});
router.patch("/updateproduct", upload.single("prodImg"), async (req, res) => {
	let { prodName, prodPrice, prodDetails, prodSnippet, id } = req.body;
	// console.log(upd);
	// put all the defined key from req.body to upd
	let upd = {};
	if (prodName) {
		upd["prodName"] = prodName;
	}

	if (prodDetails) {
		upd["prodDetails"] = prodDetails;
	}

	if (prodPrice) {
		upd["prodPrice"] = prodPrice;
	}

	if (prodSnippet) {
		upd["prodSnippet"] = prodSnippet;
	}

	// console.log(upd);

	// upd["prodDetails"] = "idosidisos";
	// console.log(upd);
	// res.json({ update: upd, id });
	// res.json({ update: "product updated" });
	if (req.file) {
		// res.json({ res: "this req has a file", id, upd });
		let toUpd = await Product.findById(id);
		// delete img from cloudinary using prodImg_id from toUpd
		let remImg = await cloudinary.uploader.destroy(toUpd.prodImg_id);
		// upload new img to cloudinary
		let newImg = await cloudinary.uploader.upload(req.file.path, {
			folder: "New_cohort8_Product",
		});
		// add prodImg_id and prodImg_url to upd
		upd["prodImg_id"] = newImg.public_id;
		upd["prodImg_url"] = newImg.secure_url;
		// update db
		Product.findByIdAndUpdate(id, { $set: upd })
			.then((ans) => {
				res.json({ Status: true });
			})
			.catch((err) => {
				res.json({ Status: false });
			});
	} else {
		// res.json({ res: "this req does not have a file", upd });
		Product.findByIdAndUpdate(id, { $set: upd })
			.then((ans) => {
				res.json({ status: true });
			})
			.catch((err) => {
				res.json({ status: false });
			});
	}
});
router.get("/single/:id", (req, res) => {
	let { id } = req.params;
	// res.json({ single: `single product with id: ${id} ` });
	Product.findById(id)
		.then((ans) => {
			res.json(ans);
		})
		.catch((err) => {
			res.json({ status: false });
		});
});

router.post("/like", (req, res) => {
	let { id, like } = req.body;
	Product.findByIdAndUpdate(id, { $inc: { prodLikes: like } })
		.then((ans) => {
			res.json({ status: true });
		})
		.catch((err) => {
			res.json({ status: false });
		});
	// res.json({ id, like });
});
// create/upload test route with front-end ui
router.post("/uploadtest", upload.single("prodImg"), (req, res) => {
	if (req.file) {
		res.json({
			status: "this axios post has a file",
			body: req.body,
			file: req.file,
		});
	} else {
		res.json({
			status: "this axios post does not have a file",
			body: req.body,
		});
	}
});
router.get("*", (req, res) => {
	res.json({ error: "Bad url. please recheck..." });
});

module.exports = {
	router,
};
