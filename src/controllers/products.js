const products = require("../models/products");

const { S200, S500 } = require("../helpers/status")
const websites = ['Daraz', "Pickaboo", "Ajkerdeal"]

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message });
};

exports.getAll = async (req, res) => {
   try {

      let condition = {}

      req.query.cat ? condition.cat = req.query.cat : false
      req.query.scat ? condition.sCat = req.query.scat : false
      req.query.mcat ? condition.mCat = req.query.mcat : false

      /** Defining query */
      var query = products.find(condition)

      /** projection */
      let projection = "-__v -createdAt -updatedAt -cat -sCat -mCat -compared -title_low";
      query = query.select(projection)

      /** Pagination */
      let page = req.query.page ? req.query.page * 1 : 1
      let limit = 15, skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)

      let response = null

      let format = req.query.format && req.query.format
      console.log(format);
      if (format === "website") {
         response = {}
         for (let website of websites) {
            response[website] = await products
               .find({ ...condition, website })
               .select(projection)
               .limit(5)
               .sort("-createdAt")
         }
      } else {
         response = await query
      }

      /** Sending response */
      res.json({ ...S200, page: page, data: response });

   } catch (error) {
      defaultError(res, error);
   }
};

exports.create = async (req, res) => {
   try {
      await products.init();
      let docRes = await products.create(req.body);
      res.json(docRes);
   } catch (error) {
      defaultError(res, { message: "DUPLICATE_PRODUCT" });
   }
};

exports.get = async (req, res) => {
   try {
      let docRes = await products.findOne({ _id: req.params.id });
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
exports.update = async (_, res) => {
   try {
      res.json("patch");
   } catch (error) {
      defaultError(res, error);
   }
};

exports.delete = async (req, res) => {
   try {
      let docRes = await products.deleteOne({ _id: req.params.id });
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};

exports.deleteAll = async (_, res) => {
   try {
      let docRes = await products.deleteMany({});
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};

exports.compareAll = async (_, res) => {
   try {
      let proCount = await products.countDocuments();
      console.log(proCount);
      let page = 1;
      let limit = 100;

      console.log(proCount / limit);

      // while ( proCount / 100 ) {

      // }

      res.json("Compare All");
   } catch (error) {
      defaultError(res, error);
   }
};

exports.compare = async (req, res) => {
   try {
      console.log(req.params.title);

      (await products.find()).forEach(function (pro) {
         console.log(pro);
      });

      res.json("docRes");
   } catch (error) {
      defaultError(res, error);
   }
};
