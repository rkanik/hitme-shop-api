const { keysInReview } = require("../models/categories");
const { S200, S404, S409, S500 } = require("../helpers/status")

exports.getAll = async (req, res) => {
   try {

      let query = keysInReview.find()

      /** Limiting */
      let limit = req.query.limit || 1
      query = query.limit(limit)

      /** Projections */
      let select = "mCat sCat cat keywords";
      query = query.select(select)

      let docRes = await query

      res.send({
         ...S200,
         data: docRes.length === 1 ? docRes[0] : null
      });

   } catch (error) {

   }
};

exports.create = async (req, res) => {
   try {
      await keysInReview.init();
      let createRes = await keysInReview.create(req.body);
      res.json(createRes);
   } catch (error) {
      let data = { ...req.body };
      let conditions = { mCat: data.mCat, sCat: data.sCat, cat: data.cat };
      let updateRes = await keysInReview.updateOne(conditions, {
         $addToSet: { keywords: data.keywords }
      });
      res.json(updateRes);
   }
};
exports.deleteAll = async (req, res) => {
   try {
      let delRes = await keysInReview.deleteMany();
      res.json(delRes);
   } catch (error) {
      res.json({ error: true, message: error.message });
   }
};

exports.get = async (req, res) => { };

exports.update = async (req, res) => { };

exports.delete = async (req, res) => {
   if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
         let docRes = await keysInReview.deleteOne({ _id: req.params.id });
         res.json(docRes);
      } catch (error) {
         res.json({ error: true, message: error.message });
      }
   } else {
      res.json({ error: true, message: "Invalid object id" });
   }
};
