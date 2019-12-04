/** PACKAGE IMPORTS */
const express = require("express");
const router = express.Router();

const controller = require("../controllers/keywords");

router
   .route("/:cat_or_id")
   .get(controller.get)
   .post(controller.create)
   .patch(controller.patch)
   .delete(controller.delete)

router
   .route("/reviewed/:cat/:sCat/:mCat")
   .patch(controller.reviewed)

module.exports = router;
