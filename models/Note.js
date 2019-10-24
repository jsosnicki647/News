const mongoose = require("mongoose")
const Schema = mongoose.Schema
const moment = require("moment")
const m = moment().format('YYYY MM DD')

const NoteSchema = new Schema({
  note: {type: String},
  time: {type: Date, default: m}
})

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema)

module.exports = Note