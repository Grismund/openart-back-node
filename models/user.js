const mongoose = require('mongoose');

//passport adds username and password to the schema behind the scenes,
//then runs them through a hashing and salting process.
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },    
        firstname: {
            type: String,
            default: ''
        },
        lastname: {
            type: String,
            default: ''
        },
        admin: {
            type: Boolean,
            default: false
        }
    }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);