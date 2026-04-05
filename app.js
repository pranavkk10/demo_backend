const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

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

const upload = multer({ storage: storage });

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
    rarity: "Ultra Rare",
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
    rarity: "Rare",
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
    rarity: "Very Rare",
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
    rarity: "Rare",
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
    rarity: "Rare",
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
    rarity: "Rare",
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
    rarity: "Uncommon",
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
    rarity: "Uncommon",
    description: "Prospect card from early in Judge's career."
  }
];


app.get("/cards", (req, res) => {
  res.json(cards);
});

app.get("/cards/:id", (req, res) => {
  const card = cards.find((c) => c._id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }
  res.json(card);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});