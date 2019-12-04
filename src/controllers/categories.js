const { categories } = require("../models/categories");

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message });
};

const sendDistinct = async (res, field, query = {}) => {
   try {
      res.json((await categories.distinct(field, query)).sort());
   } catch (error) {
      defaultError(res, error);
   }
};

exports.getAll = async (req, res) => {
   try {
      if (req.query && req.query.format && req.query.format === "normal") {
         let response = await categories.find().select("mCat sCat cat");
         res.json({
            status: 200,
            statusText: "OK",
            data: response
         });
      } else {
         let docRes = await categories.find({}, "mCat sCat cat");
         let data = [...new Set(docRes.map(m => m.mCat))].map(m => ({
            mCat: m,
            sCats: [
               ...new Set(docRes.filter(s => s.mCat === m).map(s => s.sCat))
            ].map(s => ({
               sCat: s,
               cats: [
                  ...new Set(docRes.filter(t => t.sCat === s).map(t => t.cat))
               ]
            }))
         }));
         res.json(data);
      }
   } catch (error) {
      defaultError(res, error);
   }
};
exports.createMany = async (req, res) => {
   try {
      let response = await categories.insertMany(req.body);
      res.json(response);
   } catch (error) {
      defaultError(res, error);
   }
};

exports.deleteAll = async (_, res) => {
   let delRes = await categories.deleteMany();
   res.json(delRes);
};

/** Controller related to Main Category */
exports.getMains = (_, res) => {
   sendDistinct(res, "mCat");
};

exports.getMain = async (req, res) => {
   try {
      let docRes = await categories.distinct("sCat", { mCat: req.params.mCat });
      if (docRes.length === 0) {
         defaultError(res, {
            message: `There is no Main category named ${req.params.mCat}`
         });
      } else {
         res.json({ mCat: req.params.mCat, sCats: docRes });
      }
   } catch (error) {
      defaultError(res, error);
   }
};

exports.subWithCats = async (req, res) => {
   try {
      let cRes = await categories.find(
         { mCat: req.params.mCat },
         "sCat cat -_id"
      );
      if (cRes.length === 0) {
         defaultError(res, {
            message: `There is no Main category named ${req.params.mCat}`
         });
      } else {
         let disSubs = [...new Set(cRes.map(c => c.sCat))];
         let data = disSubs.map(sCat => ({
            sCat,
            cats: cRes
               .filter(c => c.sCat === sCat)
               .map(d => d.cat)
               .sort()
         }));
         res.json(data);
      }
   } catch (error) {
      defaultError(res, error);
   }
};

exports.updateMain = async (req, res) => {
   try {
      let docRes = await categories.updateMany(
         { mCat: req.params.mCat },
         req.body
      );
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
exports.deleteMain = async (req, res) => {
   try {
      let docRes = await categories.deleteMany({ mCat: req.params.mCat });
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
/** End of main category */

/** Controller Related to Sub Category */
exports.getSubs = async (_, res) => {
   sendDistinct(res, "sCat");
};
exports.getSub = async (req, res) => {
   try {
      let docRes = await categories.find(
         { sCat: req.params.sCat },
         "sCat cat -_id"
      );
      if (docRes.length === 0) {
         defaultError(res, {
            message: `There is no Sub category named ${req.params.sCat}`
         });
      } else {
         let data = { sCat: req.params.sCat, cats: docRes.map(i => i.cat) };
         res.json(data);
      }
   } catch (error) {
      defaultError(res, error);
   }
};
exports.updateSub = async (req, res) => {
   try {
      let docRes = await categories.updateMany(
         { sCat: req.params.sCat },
         req.body
      );
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
exports.deleteSub = async (req, res) => {
   try {
      let docRes = await categories.deleteMany({ sCat: req.params.sCat });
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
/** End of Sub category */

/** Controller Related to Category */
exports.getCats = async (req, res) => {
   sendDistinct(res, "cat");
};
exports.getCat = async (req, res) => {
   try {
      let condition = { cat: req.params.cat };
      if (req.query && req.query.mCat) {
         condition.mCat = req.query.mCat;
      }
      if (req.query && req.query.sCat) {
         condition.sCat = req.query.sCat;
      }

      let docRes = await categories.findOne(condition).select("mCat sCat cat");
      if (docRes === null) {
         defaultError(res, {
            message: `There is no Category named ${req.params.cat}`
         });
      } else {
         res.send(docRes);
      }
   } catch (error) {
      defaultError(res, error);
   }
};
exports.createCat = async (req, res) => {
   // let crRes = await categories.insertMany(req.body)
   // res.json(crRes)
   try {
      if (
         (await categories
            .countDocuments({
               mCat: req.body.mCat,
               sCat: req.body.sCat,
               cat: req.body.cat
            })
            .limit(1)) === 0
      ) {
         let docRes = await categories.create(req.body);
         res.send(docRes);
      } else {
         defaultError(res, { message: "Category already exists" });
      }
   } catch (error) {
      defaultError(res, error);
   }
};
exports.updateCat = async (req, res) => {
   try {
      let docRes = await categories.updateOne(
         { cat: req.params.cat },
         req.body
      );
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};
exports.deleteCat = async (req, res) => {
   try {
      let docRes = await categories.deleteOne({ cat: req.params.cat });
      res.json(docRes);
   } catch (error) {
      defaultError(res, error);
   }
};

/** End of category */

exports.getSuggestions = async (req, res) => {
   try {
      let regex = new RegExp(`${req.params.keyword}`, "i");

      let response = await categories
         .find({ cat: { $regex: regex } })
         .limit(7)
         .select("mCat sCat cat");

      res.json({
         status: 200,
         statusText: "OK",
         data: response
      });
   } catch (error) {
      defaultError(res, error);
   }
};
