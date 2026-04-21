require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();

if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

if (!fs.existsSync("./public/images")) {
  fs.mkdirSync("./public/images", { recursive: true });
}

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const cardSchemaDB = new mongoose.Schema({
  name: { type: String, required: true },
  img_name: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  card_number: { type: String, required: true },
  sport: { type: String, required: true },
  grade: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});

const Card = mongoose.model("Card", cardSchemaDB);

const joiCardSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  img_name: Joi.string().min(3).max(300).required(),
  brand: Joi.string().min(2).max(100).required(),
  year: Joi.number().integer().min(1800).max(2100).required(),
  card_number: Joi.string().min(1).max(30).required(),
  sport: Joi.string().min(2).max(50).required(),
  grade: Joi.string().min(1).max(30).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().min(10).max(500).required()
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving cards"
    });
  }
});

app.get("/cards/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving card"
    });
  }
});

app.post("/cards", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const cardData = {
      name: req.body.name,
      img_name: `images/${req.file.filename}`,
      brand: req.body.brand,
      year: Number(req.body.year),
      card_number: req.body.card_number,
      sport: req.body.sport,
      grade: req.body.grade,
      price: Number(req.body.price),
      description: req.body.description
    };

    const { error } = joiCardSchema.validate(cardData, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message)
      });
    }

    const newCard = new Card(cardData);
    await newCard.save();

    res.status(201).json({
      success: true,
      message: "Card added successfully",
      card: newCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding card"
    });
  }
});

app.put("/cards/:id", upload.single("image"), async (req, res) => {
  try {
    const existingCard = await Card.findById(req.params.id);

    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const cardData = {
      name: req.body.name,
      img_name: req.file ? `images/${req.file.filename}` : existingCard.img_name,
      brand: req.body.brand,
      year: Number(req.body.year),
      card_number: req.body.card_number,
      sport: req.body.sport,
      grade: req.body.grade,
      price: Number(req.body.price),
      description: req.body.description
    };

    const { error } = joiCardSchema.validate(cardData, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message)
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      cardData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      card: updatedCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating card"
    });
  }
});

app.delete("/cards/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);

    if (!deletedCard) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      card: deletedCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting card"
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 