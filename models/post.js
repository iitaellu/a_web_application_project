const mongoose = require('mongoose');
const config = require('../config/database');
//const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

let postSchema = new Schema({
    owner: String,
    topic:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [],
    commentsNUM: Number,
    liked: [],
    votes: Number,
    date: String
})

module.exports = mongoose.model("Post", postSchema)