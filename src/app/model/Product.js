const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    nameProduct: {type: String, require: true},
    price: {
        mainPrice: {type: Number, require: true},
        discount: {type: Number, default: 0}
    },
    size: [String],
    color: [String],
    mainProductImage: {type: String},
    productsImage: [String],
    trangThai: {type: String},
    description: {type: String},
    groupId: {type: String},
    gender: {type: String}
}, 
{
    timestamps: true,
});

module.exports = mongoose.model('Product',Product);
