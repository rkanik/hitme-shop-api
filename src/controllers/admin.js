
const proCollection = require("../models/products")
const sldrCollection = require("../models/sliders")
const revCollection = require("../models/reviews")

const countDocuments = async (coll) => {
   let dz = await coll.countDocuments({ website: "Daraz" })
   let pb = await coll.countDocuments({ website: "Pickaboo" })
   let az = await coll.countDocuments({ website: "Ajkerdeal" })
   let ps = await coll.countDocuments({ website: "Priyoshop" })
   return {
      total: dz + pb + az + ps,
      daraz: dz,
      pickaboo: pb,
      ajkerDeal: az,
      priyoShop:ps
   }
}

exports.initDashBoard = async (_, res) => {
   try {

      let proCount = await countDocuments(proCollection)
      let revCount = await countDocuments(revCollection)
      let sliders = await countDocuments(sldrCollection)
         
      res.json({
         error: false,
         status: "OK",
         data: {
            products: proCount,
            inReviews: revCount,
            sliders:sliders
         }
      })
   } catch (error) {
      res.json({
         error: true,
         message:error.message
      })
   }
}