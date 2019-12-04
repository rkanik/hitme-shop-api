/** PACKAGE IMPORTS */
const express = require("express");
const router = express.Router();

const search = require("../controllers/search");

/** Search with keyword */
router.route("/:keyword").get(search.get);

router.route("/suggestions/:keyword")
   .get(search.suggestions)

/**
 * @Route /sliders/website/Pickaboo
 * @Route /sliders/website/Daraz */
//router.route("/:filterBy/:keyword").get(sliders.getFiltered);

/** Exporting router */
module.exports = router;
