const express = require('express');
const mongoose = require('mongoose'); 
const Joi = require('joi');
const Event = require('./models/event');
const eventSchema = require('./models/event')
require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('TicketSphere');
});

app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Event.find();
        res.json(tickets);
        console.log(tickets)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/sell', async (req, res) => {
    try {
        const { error } = eventSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { eventName, eventLocation, price } = req.body;
        
        const newEvent = new Event({
            eventName,
            eventLocation,
            price
        });
        await newEvent.save();

        res.send('Ticket listed successfully');
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
        console.log(`🚀 server running on PORT: ${port}`);
    });
});

 