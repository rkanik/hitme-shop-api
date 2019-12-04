/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const reviews = require("../controllers/reviews")

/** Categories */
router.route("/")
   .get(reviews.getAll)
   .delete(reviews.deleteAll)

router.route("/:id")
   .get(reviews.get)
   .post(reviews.saveToProduct)
   .delete(reviews.delete)

/** Exporting router */
module.exports = router