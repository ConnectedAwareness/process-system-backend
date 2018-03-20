/**
 * This module defines the relations of the DB
 */

const mongoose     = require('mongoose');
const UserModel = require('./user').UserModel
const Schema       = mongoose.Schema;

const OrganisationSchema   = new Schema({
    name: {type:String, required: true},
    coordinator_id: Number,
    users: [UserModel.schema]
});

module.exports.Organisation = mongoose.model('Organisation', OrganisationSchema);