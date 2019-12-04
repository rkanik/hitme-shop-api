/** PACKAGE IMPORTS */
const express = require("express");
const router = express.Router();

const controller = require("../controllers/categories");

/** Categories */
router
   .route("/")
   .get(controller.getAll)
   .delete(controller.deleteAll)
   .post(controller.createMany);

/** Route related to main category */
router.route("/main").get(controller.getMains);

router
   .route("/main/:mCat")
   .get(controller.getMain)
   .patch(controller.updateMain)
   .delete(controller.deleteMain);

router.route("/sub-with-cats/:mCat").get(controller.subWithCats);
/** End of main category */

/** Route related to sub category */
router.route("/sub").get(controller.getSubs);

router
   .route("/sub/:sCat")
   .get(controller.getSub)
   .patch(controller.updateSub)
   .delete(controller.deleteSub);
/** End of subcategory */

/** Route related to category */
router
   .route("/cat")
   .get(controller.getCats)
   .post(controller.createCat);

router
   .route("/cat/:cat")
   .get(controller.getCat)
   .patch(controller.updateCat)
   .delete(controller.deleteCat);
/** End of category */

router.route("/suggestions/:keyword").get(controller.getSuggestions);

module.exports = router;
