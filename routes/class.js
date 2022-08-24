const express = require("express");
const router = express.Router();
const { Class } = require("../models/Class");
const { Enroll } = require("../models/Enroll");


router.post("/postClass", (req, res) => {

  // 이미지 없이
  const newclass = new Class({
    title: req.body.title,
    writer: req.body.writer,
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


router.post("/registerClass", (req, res) => {

  const enroll = new Enroll(req.body);

  enroll.save()
  .then((enroll) => {
    res.status(200).json({
      success: true,
      enroll
    })
  })

});


module.exports = router;