/** PACKAGE IMPORTS */
const express = require("express");
const router = express.Router();
const { compareTwoStrings } = require("string-similarity");

const pro = require("../models/products");

const sleep = () => {
   return new Promise((rs, rj) => {
      setTimeout(() => {
         rs();
      }, 5000);
   });
};

const getSubWords = str => {
   let arr = str.split(" ");

   let newA = [];
   newA.push(str);

   arr.forEach((word, index) => {
      let sStr = "";
      for (let i = 0; i < arr.indexOf(word); i++) {
         if (index != i) sStr += `${arr[i]} `;
      }
      newA.push(sStr.trim());
   });

   arr.forEach((_, index) => {
      let sStr = "";
      for (let i = index + 1; i < arr.length; i++) {
         sStr += ` ${arr[i]}`;
      }
      newA.push(sStr.trim());
   });

   return newA.filter(a => a !== "");
};

router.get("/", (req, res) => {
   let mTitle = "Samsung Guru Music 2";
   let cTitle = "Samsung Metro 350";
   let c = "Samsung Galaxy A30";

   let subWords_mTitle = getSubWords(mTitle);
   //let subWords_cTitle = getSubWords(cTitle);

   let matched = 0;
   subWords_mTitle.forEach(key => {
      if (c.toLowerCase().indexOf(key) !== -1) {
         console.log(c.toLowerCase());
         console.log(key);
         matched++;
      }
   });

   let cLen = c.split(" ").length;

   let p = matched / cLen;

   res.json(p);
});

router.get("/more", async (req, res) => {
   try {
      //await pro.deleteMany({title:""})

      let products = await pro
         .find() /**{ website: "Daraz" } */
         .select("title title_low cat");
      console.log(products.length);

      for (let p of products) {
         let words = getSubWords(p.title_low);
         let or = words.map(w => ({ title_low: new RegExp(w) }));
         let docs = await pro
            .find({ $or: or, _id: { $ne: p._id }, cat: p.cat })
            .select("title title_low cat url");
         if (docs.length > 0) {
            docs.forEach(item => {
               if (compareTwoStrings(item.title_low, p.title_low) > 0.8) {
                  console.log("  -" + item.title_low + "   " + item.url);
               }
            });
         }

         //await sleep();
      }

      res.send("OK");
   } catch (error) {
      res.send(error.message);
   }
});

/** Exporting router */
module.exports = router;
