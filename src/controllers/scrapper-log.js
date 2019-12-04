
const log = require('../models/scrapper-log')
const websites = require('../js/websites')

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message })
}

exports.getAll = async (_, res) => {
   try {
      let logs = await log.find().sort("-endedAt")
      res.json(logs)
   } catch (error) { defaultError(res, error) }
}

exports.create = async (req, res) => {
   try {
      await log.init()
      let docRes = await log.create(req.body)
      res.json(docRes)
   } catch (error) { defaultError(res, error) }
}

exports.get = async (req, res) => {
   try {
      let docRes = await log.findOne({ _id: req.params.id })
      res.json(docRes)
   } catch (error) { defaultError(res, error) }
}

exports.delete = async (req, res) => {
   try {
      let docRes = await log.deleteOne({ _id: req.params.id })
      res.json(docRes)
   } catch (error) { defaultError(res, error) }
}

exports.getEnded = async (req, res) => {
   try {
      if (req.params.website === "ALL") {
         let data = {}; for (let web of Object.keys(websites)) {
            data[websites[web].NAME] = await log.findOne({ website: websites[web].NAME }, 'endedAt').sort("-endedAt")
         }; res.json(data)
      } else {
         let docRes = await log.findOne({ website: req.params.website }, 'endedAt').sort("-endedAt")
         res.json(docRes)
      }
   } catch (error) { defaultError(res, error) }
}
