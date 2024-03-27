const express = require('express');
const Joi = require('joi');
const sellSchema = require('./models/sell');

const app = express();
app.use(express.json());

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
app.listen(port, () => {
    console.log(`🚀 Running on port ${port}`);
});
