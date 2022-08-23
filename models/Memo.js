const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = mongoose.Schema({
    text: String
})


const Memo = mongoose.model('Memo', memoSchema)

module.exports = { Memo }