
/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const config = require("../controllers/scrapper-config")

/** Categories */
router.route("/")
   .get(config.getAll)
   .post(config.create)

router.route("/:id")
   .patch(config.update)
   .delete(config.delete)

router.route("/latest")
   .get(config.getLatest)

router.route("/latest-version")
   .get(config.getLatestVersion)

/** Exporting router */
module.exports = router