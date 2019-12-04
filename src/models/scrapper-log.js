
const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
   website: String,
   product: {
      scrapped: Number,
      duplicate: Number,
      saved: Number,
      inReview: Number
   },
   slider: {
      scrapped: Number,
      duplicate: Number,
      saved: Number
   },
   startedAt: Date,
   endedAt: Date
})

const scrapLog = mongoose.model("scrapper-logs", Schema)

module.exports = scrapLog