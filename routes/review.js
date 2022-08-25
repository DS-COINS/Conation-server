const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Review } = require("../models/Review");

router.post("/postReview", (req, res) => {

    // 이미지 없는 경우
    const review = new Review(req.body);

    review
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
  
router.post("/getReviews", async (req, res, next) => {
try {

    const userId = req.body.userId;
    // 로그인하지 않은 사용자
    // 전체 리뷰 리턴
    if (userId==null) {
        const review = await Review.find({})
        .populate("user", "name")
        .populate("class", "title");  

        return res.status(200).json({
            review,
        });
    }

    // 로그인한 사용자
    // 자신의 리뷰를 상단에 리턴
    const myReview = await Review.find({user: userId})
    .populate("user", "name")
    .populate("class", "title");  
    const othersReview = await Review.find({user: {$ne: userId}})
    .populate("user", "name")
    .populate("class", "title"); 
    const review = myReview.concat(othersReview);
    return res.status(200).json({
        review,
    });
} catch (err) {
    res.json({ success: false, err });
    next(err);
}
});

module.exports = router;
  