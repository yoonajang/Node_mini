require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routers = require("./routes");
const mysql = require("mysql2");
const fs = require("fs");
const app = express();
const passport = require('./passport');
const port = 3000;
const { sequelize } = require("./models");
const swaggerUi = require("swagger-ui-express"); // swagger-ui-express 설치
const swaggerFile = require("./swagger-output"); // swagger-autogen 설치

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/seoul");
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터 베이스 연결성공");
  })
  .catch((err) => {
    console.error(err);
  });

passport(app); // 소셜로그인 연결
app.use(cors());

// 미들웨어 (가장 상위에 위치)
const requestMiddleware = (req, res, next) => {
  console.log(
    moment().format("MM-DD HH:mm:ss"),
    `  [ip] ${req.ip}   [${req.method}]  ${req.rawHeaders[1]}   ${req.originalUrl}`
  );
  next();
};

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestMiddleware);
app.use("/api", routers);

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
});

// CICD 연결 테스트4
