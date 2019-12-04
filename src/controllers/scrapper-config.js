
const config = require("../models/scrapper-config")

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message })
}

exports.getAll = async (_, res) => {
   try {
      res.json(await config.find().sort("-createdAt"))
   } catch (error) { defaultError(res, error) }
}

exports.getLatest = async (_, res) => {
   try {
      let projection = { 'version': 0, "__v": 0, "updatedAt": 0 }
      res.json(await config.findOne({}, projection).sort("-version"))
   } catch (error) { defaultError(res, error) }
}

exports.getLatestVersion = async (_, res) => {
   try {
      res.json(await config.findOne({}, { version: 1 }).sort({ version: -1 }))
   } catch (error) { defaultError(res, error) }
}

exports.create = async (req, res) => {
   try {
      await config.init()
      let docRes = await config.create(req.body)
      res.json(docRes)
   }
   catch (error) { defaultError(res, error) }
}

exports.update = async (req, res) => {
   try {
      let docRes = await config.update({ _id: req.params.id }, req.body)
      res.json(docRes)
   }
   catch (error) { defaultError(res, error) }
}

exports.delete = async (req, res) => {
   try {
      let docRes = await config.deleteOne({ _id: req.params.id })
      res.json(docRes)
   }
   catch (error) { defaultError(res, error) }
}