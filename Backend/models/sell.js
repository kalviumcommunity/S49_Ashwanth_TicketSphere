const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell;
