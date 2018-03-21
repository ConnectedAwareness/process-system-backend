/**
 * This module defines the relations of the DB
 */

const mongoose     = require('mongoose');
const UserSchema = require('./user').UserSchema
const Schema       = mongoose.Schema;

const OrganisationSchema   = new Schema({
    name: {type:String, required: true},
    coordinator_id: Number,
    users: [UserSchema]
});

module.exports.Organisation = mongoose.model('Organisation', OrganisationSchema);