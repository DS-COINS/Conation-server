const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checked: {
        type: Boolean,
        default: false
    }
})


const Notification = mongoose.model('Notification', notificationSchema)

module.exports = { Notification }