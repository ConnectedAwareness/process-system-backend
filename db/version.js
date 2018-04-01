const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ElementSchema = require('./../db/element').ElementSchema

const VersionSchema = new Schema({
    published: Boolean,
    elements: [ElementSchema]
})

module.exports.VersionSchema = VersionSchema
module.exports.Version = mongoose.model('Version', VersionSchema)