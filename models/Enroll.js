const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }
})

const Enroll = mongoose.model('Enroll', enrollSchema)

module.exports = { Enroll }