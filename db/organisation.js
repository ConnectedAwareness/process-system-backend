/**
 * This module defines the relations of the DB
 */

const mongoose = require('mongoose');
const UserSchema = require('./user').UserSchema
const Schema = mongoose.Schema;

const OrganisationSchema = new Schema({
    name: { type: String, required: true },
    coordinator_id: Number,
    users: [UserSchema]
});

module.exports.Organisation = mongoose.model('Organisation', OrganisationSchema);

let Default_id = null

module.exports.getDefaultOrganisationId = () => {
    if (Default_id) return Default_id
    module.exports.Organisation.findOne({ 'name': 'DEFAULT' }, (err, organisation) => {
        if (err) console.log(err.message)
        if (!organisation) console.log(new Error('DEFAULT organisation does not exist!').message)
        else {
            Default_id = organisation._id
        }
    })
}