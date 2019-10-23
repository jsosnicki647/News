const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  teaser: {type: String},
  title: {type: String},
  link: {type:String},
  notes: [{type: Schema.Types.ObjectId, ref: "Note"}]
})

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article