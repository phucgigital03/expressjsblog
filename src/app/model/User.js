const mongoose = require('mongoose');

const User = new mongoose.Schema({
    phoneNumber: {type: Number, require: true},
    username: {type: String, require: true, default: 'user', unique: true},
    password: {type: String, require: true},
    roles: {
        user: {type: Number, require: true, default: 2001},
        addmin: {type: Number},
        editer: {type: Number},
    },
    refreshToken: {type: String},
}, 
{
    timestamps: true,
});

module.exports = mongoose.model('User',User);
