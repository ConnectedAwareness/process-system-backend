const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VersionSchema = require('./version').VersionSchema
const CommentSchema = require('./comment').CommentSchema

module.exports.ElementSchema = new Schema({
  type: {type: String, required: true},
  children: [module.exports.ElementSchema],
  organisations: [{
    organisationid: {type: String, required: true},
    comments: [CommentSchema]
  }]
});
