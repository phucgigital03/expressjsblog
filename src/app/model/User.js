const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type: String, require: true, default: 'user'},
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
