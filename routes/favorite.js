const express = require("express");
const router = express.Router();
const { Favorite } = require("../models/Favorite");
const { User } = require("../models/User");
const { Class } = require("../models/Class");

router.post("/postFavorite", async (req, res, next) => {
  try {
    const userId = req.body.userId
    const classId = req.body.classId

    // Favorite 객체 생성 후 저장
    const favorite = await Favorite(req.body);
    favorite.save()
    
    
    // User의 favorites 배열에 class를 푸시하고
    // Class의 favorites 배열에 userId를 푸시
    await User.updateOne({_id:req.body.userId},
        {$addToSet: {favorites: classId}})
    
    await Class.updateOne({_id:req.body.classId},
        {$addToSet: {favorites: userId}})
    
    return res.status(200).json({
      success: "true"
    });
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});


module.exports = router;