const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    nameProduct: {type: String, require: true},
    pricePro: {
        price: {type: Number, require: true},
        discount: {type: Number, default: 0}
    },
    size: {type: String},
    color: {type: String},
    mainProductImage: {type: String},
    productsImage: [String],
    status: {type: String},
    description: {type: String},
    groupId: {type: String},
    gender: {type: String},
    countInstock: {type: Number,default: 1}
}, 
{
    timestamps: true,
});

module.exports = mongoose.model('Product',Product);
