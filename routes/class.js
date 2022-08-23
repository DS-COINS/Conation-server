const express = require("express");
const router = express.Router();
const { Class } = require("../models/Class");


router.post("/postClass", (req, res) => {
    const newclass = new Class({
      title: req.body.title,
      placetype: req.body.placetype,
      category: req.body.category,
      content: req.body.content
    });
  
    newclass
      .save()
      .then((result) => {
        res.status(200).json({
          success: true,
          result: result,
        });
      })
      .catch((err) => {
        res.json({ success: false, err });
      });
  });
  




module.exports = router;