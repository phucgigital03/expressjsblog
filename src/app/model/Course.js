const mongoose = require('mongoose')

const Course = new mongoose.Schema({
    name: { type: String },
    price: {type: Number},
    description: {type: String},
    image: {type: String},
    videoId: {type: String},
    typeCourse: {type: Array},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Course',Course);
