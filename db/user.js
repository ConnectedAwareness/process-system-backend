const mongoose = require('mongoose')
const Organisation = require('./organisation').Organisation
const Schema = mongoose.Schema

const UserSchema = new Schema({
        email: { type: String, required: true },
        password: { type: String, required: true },
        alias: String,
        first_name: String,
        last_name: String,
        token: String,
        token_date: Date,
        role: String
    })
    // UserSchema.pre('validate', function(next, val) {
    //     console.log(val())
    //         //TODO: unique email
    //     next()
    // })

module.exports.UserSchema = UserSchema