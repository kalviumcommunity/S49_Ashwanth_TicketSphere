const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
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
    },
    // poster: {
    //     type: String, // Store the URL or path to the image
    //     required: true
    // }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
