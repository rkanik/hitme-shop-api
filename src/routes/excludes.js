/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const excludes = require("../controllers/excludes")

/** Categories */
router.route("/")
   .get(excludes.getAll)
   .post(excludes.create)

router.route("/:key/:value")
   .get(excludes.get)
   .delete(excludes.delete)

/** Exporting router */
module.exports = router