const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    userId: {type: String, default: ''},
    email: {type: String},
    fullName: {type: String},
    phone: {type: Number},
    address: {type: String, require: true},
    provinces: {type: String, require: true},
    district: {type: String, require: true},
    commune: {type: String, require: true},
    totalQty: {type: Number, default: 1},
    payment: {type: String, require: true},
    totalPrice: {type: Number, require: true},
    status: {type: String, require: true},
    products: [mongoose.Types.ObjectId],
    codeSale: {type: String, default: ''},
    shipping: {type: Number, default: 30},
    remoteAddress: {type: String, default: ''},
}, 
{
    timestamps: true,
});

module.exports = mongoose.model('Order',Order);
