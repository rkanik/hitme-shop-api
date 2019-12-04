const { categories } = require("../models/categories");
const { getSubWords } = require("../helpers");

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message });
};

const updateOne = async (req, res, query) => {
   let condition = { cat: req.params.cat };
   console.log(condition, query);
   try {
      res.json(await categories.updateOne(condition, query));
   } catch (error) {
      defaultError(res, error);
   }
};

exports.get = async (req, res) => {
   try {
      let limit = req.query.limit ? req.query.limit * 1 : 20;
      let skip = req.query.page ? (req.query.page * 1 - 1) * limit : 0;

      console.log(skip, limit);

      let docRes = await categories
         .findOne({ cat: req.params.cat_or_id })
         .select({ keywords: { $slice: [skip, limit] } })
         .select("-mCat -sCat -cat -__v -_id");

      res.json({ status: 200, statusText: "OK", data: docRes.keywords });
   } catch (error) {
      defaultError(res, error);
   }
};

exports.create = async (req, res) => {
   updateOne(req, res, { keywords: req.body });
};

exports.patch = async (req, res) => {
   try {
      let response = await categories.updateOne(
         { $or: [{ cat: req.params.cat_or_id }, { _id: req.params.cat_or_id }] },
         { $addToSet: req.body }
      );
      res.json(response);
   } catch (error) {
      defaultError(res, error);
   }
};
exports.reviewed = async (req, res) => {
   try {
      let response = await categories.updateOne(req.params, { $addToSet: { keywords: req.body } });
      res.json(response);
   } catch (error) {
      defaultError(res, error);
   }
};

exports.delete = async (req, res) => {
   try {
      let response = await categories.updateOne(
         { cat: req.params.cat_or_id },
         { $pull: { keywords: { $in: req.body.keywords } } }
      );
      res.json({
         status: 200,
         statusText: "OK",
         data: response
      });
   } catch (error) {
      defaultError(res, error);
   }
   //console.log(req.params);
   //updateOne(req, res, { $pull: { keywords: { $in: req.body.keywords } } });
};
