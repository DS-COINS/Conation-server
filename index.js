const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // 로그인 토큰을 쿠키에 저장하기
require("dotenv").config();  // .env 파일에서 읽어오기

const app = express();
const port = process.env.PORT || 5000;  // 백 서버 포트 설정

app.use(bodyParser.urlencoded({ extended: true })); // 바디파서가 클라이언트에서 오는 정보를 분석해서 가져올 수 있도록
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB 연결
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL, {
    //  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));


app.get('/', (req, res) => { // 루트 디렉토리에 라우트 시
    res.send('Hello World!'); // 웹사이트에 출력
});

// 라우터
app.use("/api/users", require("./routes/users"));
app.use("/api/class", require("./routes/class"));
app.use("/api/favorite", require("./routes/favorite"));
app.use("/api/memo", require("./routes/memo"));

app.listen(port, () => { // 포트(5000)에서 실행(listen)
    console.log(`Example app listening on port ${port}`) // 서버 구동 시 터미널 콘솔에 출력
})