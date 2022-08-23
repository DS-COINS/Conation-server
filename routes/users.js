const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");


router.post("/getUserInfo", (req, res) => {
    User.findOne({_id: req.body._id})
    .exec((err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true, user
      });
    });
});


/* 아래는 auth 관련 라우트 */

router.get("/auth", auth, (req, res) => {
    // 미들웨어를 통과해 여기까지 왔다면 Authentication이 true
    // 미들웨어에서 req.user = user 해줘서 여기서 쓸 수 있음
    res.status(200).json({
      _id: req.user._id,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      image: req.user.image,
      favorites: req.user.favorites,
    });
  });
  
  router.post("/register", (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다
  
    const user = new User(req.body); // json 객체가 들어 있음 (bodyparser 이용)
  
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
      });
    });
  });
  
  router.post("/login", (req, res) => {
    // 요청된 이메일이 DB에 있는지 찾는다
  
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
      //  이메일이 있다면 비밀번호가 맞는 비밀번호인지 확인
      // comparePassword() 메소드는 User 스키마에 만든다
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });
  
        // 비밀번호까지 맞다면 토큰을 생성하기
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
  
          // 매개변수 user로 받아온 토큰을 저장한다.
          // 어디에? (개발자 임의로) 쿠키, 로컬스토리지, 세션스토리지 등등...
          // 쿠키에 저장하기: cookie-parser 라이브러리
          // 세션에 저장하기: 
          res
            .cookie("x_auth", user.token) // x_auth 변수에 토큰 저장됨
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });
    });
  });
  
  router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    });
  });
  
  module.exports = router;
  