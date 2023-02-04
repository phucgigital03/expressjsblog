const mongoose = require('mongoose');

const ProductOrder = new mongoose.Schema({
    name: {type: String, require: true},
    pricePro: {
        price: {type: Number, require: true},
        discount: {type: Number, default: 0}
    },
    image: {type: String, require: true},
    size: {type: String,require: true},
    color: {type: String,require: true},
    groupId: {type: String,require: true},
    gender: {type: String,require: true},
    quatity: {type: Number, require: true},
    slug: {type: String, require: true, unique: true},
}, 
{
    timestamps: true,
});

module.exports = mongoose.model('ProductOrder',ProductOrder);
