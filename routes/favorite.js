const express = require("express");
const router = express.Router();
const { Favorite } = require("../models/Favorite");
const { User } = require("../models/User");
const { Class } = require("../models/Class");

router.post("/postFavorite", async (req, res, next) => {
  try {

    const userId = req.body.userId
    const classId = req.body.classId

    /* 찜하기 취소 */
    // 이미 Favorite 했는지 검사
    const isExists = await Favorite.findOne(req.body)
    if (isExists) {
        // Favorite 콜렉션에서 제거
        isExists.remove();

        // 배열에서 삭제
        await User.updateOne({_id:req.body.userId},
            {$pull: {favorites: { $in: [classId]}}})
        
        await Class.updateOne({_id:req.body.classId},
            {$pull: {favorites: userId}})

        return res.status(200).json({
            success: true,
            heart: false
        });
    }

    /* 찜하기 */

    // Favorite 객체 생성 후 콜렉션에 저장
    const favorite = await Favorite(req.body);
    favorite.save()
    
    // 배열에 추가
    // User의 favorites 배열에 class를 푸시하고
    // Class의 favorites 배열에 userId를 푸시
    await User.updateOne({_id:req.body.userId},
        {$addToSet: {favorites: classId}})
    
    await Class.updateOne({_id:req.body.classId},
        {$addToSet: {favorites: userId}})
    
    return res.status(200).json({
      success: true,
      heart: true
    });
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});


module.exports = router;