const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");
const Offer = require("../models/Offer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const { title, description, price, condition, city, brand, size, color } =
      req.fields;

    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        { MARQUE: brand },
        { TAILLE: size },
        { ÉTAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ],
      owner: req.user,
    });
    const result = await cloudinary.uploader.upload(req.files.picture.path, {
      folder: `/vinted-2/offers/${newOffer._id}`,
    });

    newOffer.product_image = result;
    await newOffer.save();
    res.status(200).json(newOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
