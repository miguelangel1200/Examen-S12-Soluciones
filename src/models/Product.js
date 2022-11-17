const { Schema, model } = require('mongoose');

const Product = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    proveedor: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 12
    },
    price: Number,
    imageURL: String,
    public_id: String
});

module.exports = model('Product', Product);