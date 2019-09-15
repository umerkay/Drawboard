const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    paths: {
        type: Array,
        default:[]
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    owner: {
        type: String,
        required: false
    },
    background: {
        type: String,
        default: '#ffffff'
    }
});

module.exports = Board = mongoose.model('board', BoardSchema);