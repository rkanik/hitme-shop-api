
/** PACKAGE IMPORTS */
const express = require('express')
const router = express.Router()

const log = require("../controllers/scrapper-log")

/** Categories */
router.route("/")
   .get(log.getAll)
   .post(log.create)

router.route("/:id")
   .get(log.get)
   .delete(log.delete)

router.route("/ended/:website")
   .get(log.getEnded)

/** Exporting router */
module.exports = router