const express = require('express');
const mongoose = require('mongoose');
const Event = require('./models/event');
const eventSchema = require('./models/event');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const Clerk = require("@clerk/clerk-sdk-node");



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



app.get('/', (req, res) => {
  res.send('TicketSphere');
});

app.get('/tickets', async (req, res) => {
  try {
    const tickets = await Event.find();
    res.json(tickets);
    console.log(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/sell', upload.single('file'), async (req, res) => {
  const imagePath = req.file ? `${req.protocol}://${req.get('host')}/Images/${req.file.filename}` : '';

  const newEvent = new Event({
    eventName: req.body.eventName,
    eventLocation: req.body.eventLocation,
    price: req.body.price,
    poster: imagePath, 
    category: req.body.category,
    sellerName: req.body.sellerName || "Anonymous",
  });

  try {
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


const port = 3000;

async function Connection() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
}

Connection().then(() => {
  app.listen(port, () => {
    console.log(` server running on PORT: ${port}`);
  });
});