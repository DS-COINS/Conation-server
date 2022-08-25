const express = require("express");
const router = express.Router();
const { Class } = require("../models/Class");
const { Enroll } = require("../models/Enroll");
const { User } = require("../models/User");
const { Notification } = require("../models/Notification");

router.post("/post", (req, res) => {

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


router.post("/register", async (req, res, next) => {
  try{

    const enroll = new Enroll(req.body);
    const notification = new Notification(req.body);

    await enroll.save()
    await notification.save()

    return res.status(200).json({
      success: true
    })

} catch (err) {
  res.json({ success: false, err });
  next(err);
}



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

router.post("/getClassDetail", async (req, res, next) => {
  try {
    const result = await Class.findOne({ _id: req.body._id })
      .populate("writer")

    const applicantTemp = await Enroll.find({ writer: result.writer._id})
      .populate("applicant", "name")
    const applicant = [];
    for(var i=0; i<applicantTemp.length; i++) {
      const id = applicantTemp[i].applicant._id
      const name = applicantTemp[i].applicant.name
      applicant.push({_id: id, name: name});
   }
    
    // 추천 클래스 배열 (추후 인공지능 서버와 연결)
    const recommend = await Class.find({category: result.category})
    // 추천 클래스 4개만 전송
    const recommend4 = recommend.slice(0,4) 
    
    return res.status(200).json({
      success: true,
      result,
      applicant,
      recommend: recommend4
    });
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});

module.exports = router;