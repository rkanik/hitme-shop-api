const sliders = require("../models/sliders");

const defaultError = (res, error) => {
   res.json({ error: true, message: error.message });
};

exports.getAll = async (_, __) => {
   try {
      let projection = "src website url";
      let res = await sliders.find().select(projection);
      __.json(res);
   } catch (error) {
      defaultError(__, error);
   }
};

exports.get = async (_, __) => {
   try {
      let projection = "src website url";
      let res = await sliders.findOne({ _id: _.params.id }).select(projection);
      __.json(res);
   } catch (error) {
      defaultError(__, error);
   }
};

exports.getFiltered = async (req, __) => {
   try {
      let projection = "src website url";
      let condition = { [req.params.filterBy]: req.params.keyword };
      let res = await sliders.find(condition).select(projection);
      __.json(res);
   } catch (error) {
      defaultError(__, error);
   }
};

exports.create = async (_, __) => {
   try {
      let res = await sliders.find();
   } catch (error) {
      defaultError(__, error);
   }
};

exports.delete = async (_, __) => {
   try {
      let res = await sliders.find();
   } catch (error) {
      defaultError(__, error);
   }
};
