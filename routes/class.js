const express = require("express");
const router = express.Router();
const { Class } = require("../models/Class");
const { Enroll } = require("../models/Enroll");
const { User } = require("../models/User");

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

  /* 신청 알림 생성 */
  

});


router.get("/getClassList", async (req, res, next) => {
  try {
  
    let result;
    if (req.query.category) {
      result = await Class.find({ category: req.query.category })
    } else {
      result = await Class.find()
    }

    return res.status(200).json({ success: true, result });
      
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }

});


router.get("/search", (req, res) => {
  let keyword = req.query.keyword;
  Class.find( {$or:[{ title: {$regex : keyword} }, 
                        { content: {$regex : keyword} },
                        { category: {$regex : keyword}}
                        ]})
    .exec((err, result) => {
      if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, result });
    });
});

router.post("/getClassDetail", (req, res) => {
  Class.findOne({ _id: req.body._id })
    .populate("writer")
    .exec((err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, result });
  });
});

module.exports = router;