const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const fs = require("fs");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

let cards = [
  {
    _id: 1,
    name: "Michael Jordan",
    img_name: "images/Michael.jpeg",
    brand: "Fleer",
    year: 1986,
    card_number: "#57",
    sport: "Basketball",
    grade: "PSA 10",
    price: 250000,
    description: "Iconic rookie-era card highly prized by collectors."
  },
  {
    _id: 2,
    name: "Wayne Gretzky",
    img_name: "images/Wayne.jpeg",
    brand: "O-Pee-Chee",
    year: 1979,
    card_number: "#18",
    sport: "Hockey",
    grade: "PSA 10",
    price: 150000,
    description: "Classic Gretzky early-career issue from O-Pee-Chee."
  },
  {
    _id: 3,
    name: "Tom Brady",
    img_name: "images/Tom.jpeg",
    brand: "Playoff Contenders",
    year: 2000,
    card_number: "#144",
    sport: "Football",
    grade: "PSA 8",
    price: 125000,
    description: "Popular collector's card with limited print run."
  },
  {
    _id: 4,
    name: "Kobe Bryant",
    img_name: "images/Kobe.jpeg",
    brand: "Topps Chrome",
    year: 1996,
    card_number: "#138",
    sport: "Basketball",
    grade: "PSA 10",
    price: 95000,
    description: "Early Kobe card in chrome finish; highly desirable."
  },
  {
    _id: 5,
    name: "Lionel Messi",
    img_name: "images/Messi.jpeg",
    brand: "Topps",
    year: 2011,
    card_number: "#2011",
    sport: "Soccer",
    grade: "PSA 10",
    price: 85000,
    description: "Topps release during Messi's prime years."
  },
  {
    _id: 6,
    name: "Derek Jeter",
    img_name: "images/derek.jpeg",
    brand: "SP",
    year: 1993,
    card_number: "#279",
    sport: "Baseball",
    grade: "PSA 10",
    price: 75000,
    description: "Early Jeter card from the SP set."
  },
  {
    _id: 7,
    name: "LeBron James",
    img_name: "images/Lebron.jpeg",
    brand: "Upper Deck",
    year: 2003,
    card_number: "#23",
    sport: "Basketball",
    grade: "PSA 9",
    price: 65000,
    description: "A standout LeBron rookie-era card."
  },
  {
    _id: 8,
    name: "Aaron Judge",
    img_name: "images/Judge.jpeg",
    brand: "Topps",
    year: 2013,
    card_number: "#AAR13",
    sport: "Baseball",
    grade: "PSA 9",
    price: 45000,
    description: "Prospect card from early in Judge's career."
  }
];

const cardSchema = Joi.object({
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

app.get("/cards", (req, res) => {
  res.json(cards);
});

app.get("/cards/:id", (req, res) => {
  const card = cards.find((c) => c._id === parseInt(req.params.id));

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  res.json(card);
});

app.post("/cards", upload.single("image"), (req, res) => {
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

  const { error } = cardSchema.validate(cardData, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  const newCard = {
    _id: cards.length ? cards[cards.length - 1]._id + 1 : 1,
    ...cardData
  };

  cards.push(newCard);

  res.status(201).json({
    success: true,
    message: "Card added successfully",
    card: newCard
  });
});

app.put("/cards/:id", upload.single("image"), (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = cards.findIndex((card) => card._id === id);

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  const currentCard = cards[cardIndex];

  const cardData = {
    name: req.body.name,
    img_name: req.file ? `images/${req.file.filename}` : currentCard.img_name,
    brand: req.body.brand,
    year: Number(req.body.year),
    card_number: req.body.card_number,
    sport: req.body.sport,
    grade: req.body.grade,
    price: Number(req.body.price),
    description: req.body.description
  };

  const { error } = cardSchema.validate(cardData, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  const updatedCard = {
    _id: currentCard._id,
    ...cardData
  };

  cards[cardIndex] = updatedCard;

  res.status(200).json({
    success: true,
    message: "Card updated successfully",
    card: updatedCard
  });
});

app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = cards.findIndex((card) => card._id === id);

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Card not found"
    });
  }

  const deletedCard = cards[cardIndex];
  cards.splice(cardIndex, 1);

  res.status(200).json({
    success: true,
    message: "Card deleted successfully",
    card: deletedCard
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});