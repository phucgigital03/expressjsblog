const mongoose = require('mongoose');

const Inventory = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, require: true},
    quatity: {type: Number, require: true},
    reservations: [
        {
            userId: {type: Number},
            productId: {type: Number},
            quatity: {type: Number},
            slug: {type: String, unique: true, require: true},
        }
    ]
},{
    timestamps: true
});

module.exports = mongoose.model('Inventory',Inventory);
