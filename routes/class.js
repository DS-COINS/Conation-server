const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { Class } = require("../models/Class");
const { Enroll } = require("../models/Enroll");
const { User } = require("../models/User");
const { Notification } = require("../models/Notification");

/* 이미지를 포함한 후기 업로드 */

const DIR = "./public/class/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  }, //file 을 받아와서 DIR 경로에 저장한다.
  filename: (req, file, cb) => {
    // 저장할 파일의 이름을 설정한다.
    //const fileName = file.originalname.toLowerCase().split(' ').join('-');
    //cb(null, uuidv4() + '-' + fileName)
    // (uuidv4 O) 7c7c98c7-1d46-4305-ba3c-f2dc305e16b0-통지서
    // (uuidv4 X) 통지서

    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);  // 원본파일이름 사용하지 않음
    cb(null, Date.now() + extension);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 파일 확장자 필터
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
    }
  },
});

const nullImage = "http://localhost:5001/public/class/nullImage.png"  // 빈 이미지 경로

router.post("/post",  upload.single("image"), (req, res, next) => {

  if (req.file == null) {
    /* 이미지가 없는 경우 */
    const newclass = new Class({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      writer: req.body.writer,
      placetype: req.body.placetype,
      category: req.body.category,
      content: req.body.content,
      contact: req.body.contact,
      image: nullImage,
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
    
  } else {

    /* 이미지가 있는 경우 */

    // upload.single('image') 에서 image 는 formData 의 key 를 말한다.
    // 따라서 "image" key 의 value 값을 서버의 지정된 폴더에 저장한다.
    const url = req.protocol + "://" + req.get("host");
    // req.protocol => http or https
    // req.get('host') => (현재) localhost:5001
    const newclass = new Class({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      writer: req.body.writer,
      placetype: req.body.placetype,
      category: req.body.category,
      content: req.body.content,
      contact: req.body.contact,
      image: url + "/public/class/" + req.file.filename,
    });

    newclass
      .save()
      .then((result) => {
        res.status(201).json({
          success: true,
          uploaded: {
            _id: result._id,
            image: result.image,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });

    
  }
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

    // 클래스 신청자 배열
    const applicantTemp = await Enroll.find({ writer: result.writer._id})
      .populate("applicant", "name")
    const applicant = [];
    for(var i=0; i<applicantTemp.length; i++) {
      const id = applicantTemp[i].applicant._id
      const name = applicantTemp[i].applicant.name
      applicant.push({_id: id, name: name});
    }
    

    // 추천 클래스 배열 (추후 인공지능 서버와 연결)
    //const recommend = await Class.find({category: result.category})
    
    const title = result.title
    const category = result.category

    try {
        
        await axios
          .post(`http://localhost:5000/exactRecommend`, {
            title, category
          })
          .then((response) => {
            recommend = response.data.result;
            console.log(response.data);
          });
        await axios
          .post(`http://localhost:5000/similarRecommend`, {
            title, category
          })
          .then((response) => {
            recommend = response.data.result;
            console.log(response.data);
          });
      } catch (e) {
        return res.status(200).json({ success: false, err: e });
      }
    

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