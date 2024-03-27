const express = require('express');
const mongoose = require('mongoose'); 
const Joi = require('joi');
const sellSchema = require('./models/sell');
require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('TicketSphere');
});

app.get('/tickets', (req, res) => {
    res.send('Viewing available tickets');
});

app.post('/sell', (req, res) => {
    const { error } = sellSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { eventName, eventLocation, price } = req.body;
    const newTicket = {
        eventName,
        eventLocation,
        price
    };

    res.send('Ticket listed successfully');
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

 