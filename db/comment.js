const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.CommentSchema = new Schema({
  userid: {type: Schema.Types.ObjectId, required: true},
  comment: String,
  vote: {type: Number, required: true}
});