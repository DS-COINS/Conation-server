const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }
})


const Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = { Favorite }