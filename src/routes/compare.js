/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const products = require("../controllers/compare")

router.route("/")
   .get(products.compareAll)

router.route("/:title")
   .get(products.compare)

/** Exporting router */
module.exports = router