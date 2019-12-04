const products = require('../models/products')
const { getSubWords } = require("../helpers")
const { compareTwoStrings } = require('string-similarity')

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message })
}

exports.compareAll = async (_, res) => {
   try {

      let started = Date.now()

      let allProducts = await products.find().select('title _id')
      allProducts = allProducts.filter(pro => pro.title !== "")

      console.log(`\nProducts : ${allProducts.length}`);

      let compared = []

      allProducts.forEach(ol => {
         let com = { target: ol, matched: [] }
         allProducts.forEach(il => {
            if (ol.title !== il.title && compareTwoStrings(ol.title, il.title) >= 0.8) {
               com.matched.push(il)
            }
         })
         compared.push(com)
      })

      res.json(compared)
      console.log(`Time taken : ${(Date.now() - started) / 1000}s\n`);

   } catch (error) { defaultError(res, error) }
}

exports.compare = async (req, res) => {
   try {
      console.log(req.params);
      let words = getSubWords(req.params.title);
      let or = words.map(word => ({ title: new RegExp(word, "i") }));
      let docs = await products
         .find({ $or: or })
         .select("-__v -createdAt -updatedAt -cat -sCat -mCat -compared -title_low");
      if (docs.length > 0) {
         let matched = []
         docs.forEach(item => {
            if (compareTwoStrings(
               item.title.toLowerCase(),
               req.params.title.toLowerCase()) > 0.8) {
               matched.push(item)
            }
         });
         res.json({
            results: matched.length,
            data: matched
         })
      }
   } catch (error) { defaultError(res, error) }
}