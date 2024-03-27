const Joi = require('joi');

// Define the schema for selling tickets
const sellSchema = Joi.object({
    eventName: Joi.string().required(),
    eventLocation: Joi.string().required(),
    price: Joi.number().positive().required()
});

module.exports = sellSchema;
