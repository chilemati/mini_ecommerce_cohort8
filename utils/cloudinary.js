var cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

cloudinary.config({
	cloud_name: "chilemathy",
	api_key: "953496373773957",
	api_secret: "JKw6pBIiYWEGaRh2C7XzAzKYmII",
	secure: true,
});

module.exports = { cloudinary };
