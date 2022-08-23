const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
    },
    category: {
        type: String,
        trim: true
    },
    contents: {
        type: String
    },
    image: String,
    placetype: Boolean,
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})


const Class = mongoose.model('Class', classSchema)

module.exports = { Class }