
const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
   version: {
      type: Number,
      unique: true
   },
   running: {
      type: Boolean,
      default: true
   },
   scrapEvery: {
      time: Number,
      unit: String
   },
   lastScrapped: {
      type: Date,
      default: Date.now()
   },
   createdAt: {
      type: Date,
      default: Date.now(),
      select: false
   },
   updatedAt: {
      type: Date,
      default: Date.now(),
   }
})

const scrprConfig = mongoose.model("scrapper-configs", Schema)

module.exports = scrprConfig