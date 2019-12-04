/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const products = require("../controllers/products")

/** Categories */
router.route("/")
   .get(products.getAll)
   .post(products.create)
   .delete(products.deleteAll)

router.route("/:id")
   .get(products.get)
   .patch(products.update)
   .delete(products.delete)

router.route("/compare")
   .get(products.compareAll)

router.route("/compare/:title")
   .get(products.compare)

/** Exporting router */
module.exports = router