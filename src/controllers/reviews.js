
const reviews = require('../models/reviews')
const products = require("../models/products")
const { categories } = require("../models/categories")
const { keysInReview } = require("../models/categories")
const { getSubWords } = require("../helpers")
const { S200, S404, S500, S409 } = require("../helpers/status")

exports.getAll = async (req, res) => {
   try {

      /** Query */
      let query = reviews.find()

      /** Pagination */
      let page = req.query.page || 1
      let limit = 15, skip = (page * 1 - 1) * limit
      query = query.skip(skip).limit(limit)

      /** Projection */
      let projections = "title src website cats"
      query = query.select(projections)

      /** Sort by */
      query = query.sort('-createdAt')

      /** Executing query */
      let docRes = await query

      /** Sending response */
      res.json({
         ...S200,
         page: page,
         data: docRes
      })

   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}

exports.get = async (req, res) => {
   try {
      let projection = "-_id title src url oPrice sPrice tags rating ratingCount website flag discount"
      let docRes = await reviews.findOne({ _id: req.params.id }, projection)
      res.json(docRes)
   } catch (error) {
      res.json({
         ...S500,
         data: error.message
      })
   }
}

exports.saveToProduct = async (req, res) => {
   try {
      let cats = { ...req.body.cats }, isNew = req.body.isNew
      let response = await reviews.findOne({ _id: req.params.id }).select("-_id -__v -cats -createdAt")
      let product = { ...response._doc, ...cats }
      try {
         await products.create(product)
         await reviews.deleteOne({ _id: req.params.id })
         let keywords = getSubWords(product.title.toLowerCase())
         if (isNew) {
            await categories.create({ ...cats, keywords: [] })
            await keysInReview.create({ ...cats, keywords })
            res.json({
               ...S200,
               data: "Product saved and keywords in-review created successfully!"
            })
         } else {
            let catRes = await keysInReview.findOne({ ...cats }).select("cat")
            if (catRes === null) {
               await keysInReview.create({ ...cats, keywords })
               res.json({
                  ...S200,
                  data: "Product saved and keywords in-review created successfully!"
               })
            } else {
               await keysInReview.updateOne({ ...cats }, {
                  $addToSet: { keywords }
               })
               res.json({
                  ...S200,
                  data: "Product saved and keywords in-review updated successfully!"
               })
            }
         }
      } catch (error) {
         if (error.code === 11000) {
            await reviews.deleteOne({ _id: req.params.id })
            res.json({
               ...S200,
               data: "Product already exist, deleted from review"
            })
         } else {
            res.json({
               ...S500,
               data: error.message
            })
         }
      }
   } catch (error) {
      res.json({
         ...S500,
         message: error.message
      })
   }
}

exports.delete = async (req, res) => {
   try {
      let docRes = await reviews.deleteOne({ _id: req.params.id })
      res.json(docRes)
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}

exports.deleteAll = async (_, res) => {
   try {
      let delRes = await reviews.deleteMany()
      res.json(delRes)
   } catch (error) {
      res.json({
         error: true,
         message: error.message
      })
   }
}