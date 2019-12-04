
const excludes = require('../models/excludes')

exports.getAll = async (_, res) => {
   try {
      let docRes = await excludes.find({}, 'key')
      res.json(docRes)
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}

exports.create = async (req, res) => {
   try {
      await excludes.init()
      let data = []
      req.body.length === undefined ? data.push(req.body) : data = req.body.map(key => ({ key }))
      let duplicates = []
      for (let k of data) {
         try {
            await excludes.create(k)
         } catch (error) {
            duplicates.push(k.key)
         }
      }
      if (duplicates.length > 0) res.send({ error: true, duplicates })
      else res.send({ error: false, message: "Keywords saved successfully!" })
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}

exports.get = async (req, res) => {
   let condition = {}; condition[req.params.key] = req.params.value
   try {
      let docRes = await excludes.findOne(condition, 'key')
      res.json(docRes)
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}

exports.delete = async (req, res) => {
   let condition = {}; condition[req.params.key] = req.params.value
   try {
      let docRes = await excludes.deleteOne(condition)
      res.json(docRes)
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}