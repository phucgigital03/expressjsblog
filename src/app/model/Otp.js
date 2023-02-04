const mongoose = require('mongoose');

const Otp = new mongoose.Schema({
    codeOtp: {type: String, unique: true, require: true},
    phone: {type: Number, require: true},
    time: {type: Date, default: Date.now, index: {expires: 60}}
});

module.exports = mongoose.model('Otp',Otp);
