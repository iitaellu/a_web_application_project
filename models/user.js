const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User schema
const Schema = mongoose.Schema;
let UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registerDate: {
        type: String
    },
    bio:{
        type: String
    },
    bioEditDate:{
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

//Finds User by id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}
//finds user by username
module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username}
    User.findOne(query, callback);
}

//add new user to database
module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback)
        });
    });
}

//compares given password to right one
module.exports.comparePassword = function(candididatePassword, hash, callBack) {
    bcrypt.compare(candididatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callBack(null, isMatch);
    });
}