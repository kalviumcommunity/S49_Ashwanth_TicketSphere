const express = require('express');
const mongoose = require('mongoose');
const Event = require('./models/event');
const cors = require('cors');
require('dotenv').config();
const Clerk = require("@clerk/clerk-sdk-node");
const Buy = require('./models/buy');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('TicketSphere');
});

app.get('/tickets', async (req, res) => {
  try {
    const tickets = await Event.find();
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/sell', async (req, res) => {
  const { 
    eventName, 
    eventLocation, 
    price, 
    poster,
    category, 
    sellerName = "Anonymous", 
    description, 
    date, 
    phoneNumber, 
    quantity 
  } = req.body;

  const newEvent = new Event({
    eventName,
    eventLocation,
    price,
    poster,
    category,
    sellerName,
    description,
    date,
    phoneNumber,
    initialQuantity: quantity,
    remainingQuantity: quantity,
  });

  try {
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/update-quantity/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    event.remainingQuantity -= quantity;
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/buys', async (req, res) => {
  try {
    const { eventName, sellerName, buyerName, location, category, quantity, totalPrice, poster } = req.body;

    const newTransaction = new Buy({
      eventName,
      sellerName,
      buyerName,
      location,
      category,
      quantity,
      totalPrice,
      poster
    });

    await newTransaction.save();

    console.log('Transaction details saved successfully.');
    res.status(200).send('Transaction details saved successfully.');
  } catch (error) {
    console.error('Error saving transaction details:', error);
    res.status(500).send('Error saving transaction details.');
  }
});

app.get('/buys', async (req, res) => {
  try {
    const boughtTickets = await Buy.find();
    res.json(boughtTickets);
  } catch (error) {
    console.error('Error fetching bought tickets:', error);
    res.status(500).send('Error fetching bought tickets.');
  }
});

app.get('/tickets/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/tickets/:id', async (req, res) => {
  try {
    const ticket = await Event.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ticket unlisted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/tickets/:id', async (req, res) => {
  const { eventName, eventLocation, price, category, description, date, quantity } = req.body;

  try {
    const updatedTicket = await Event.findByIdAndUpdate(req.params.id, {
      eventName,
      eventLocation,
      price,
      category,
      description,
      date,
      remainingQuantity: quantity,
    }, { new: true });

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
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
    console.log(`Server running on PORT: ${port} 🚀 `);
  });
});
