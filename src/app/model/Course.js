const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    name: { type: String, require: true},
    price: {type: Number},
    description: {type: String},
    image: {type: String},
    videoId: {type: String},
    typeCourse: {type: Array},
    slug: { type: String, slug: 'name', unique: true },
}, 
{
    timestamps: true,
});

// add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, 
{ 
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Course',Course);
