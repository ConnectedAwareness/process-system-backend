const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const UserSchema   = new Schema({
    email: {type:String, required: true},
    password: {type:String, required: true},
    alias: String,
    first_name: String,
    last_name: String,
    token: String,
    token_date: Date,
    role: String
});

module.exports.UserSchema = UserSchema
// module.exports.UserModel = mongoose.model('User', UserSchema)