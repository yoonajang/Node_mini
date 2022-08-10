require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routers = require('./routes');
const fs = require('fs');
const port = 8080;
const app = express();

// 서울 시간으로 셋팅 (지역에 따라 시간 셋팅으로 변경 필요)
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/seoul');

app.use(cors()); 

// 미들웨어 (가장 상위에 위치)
const requestMiddleware = (req, res, next) => {
    console.log(
        moment().format("MM-DD HH:mm:ss"), `  [ip] ${req.ip}   [${req.method}]  ${req.rawHeaders[1]}   ${req.originalUrl}`
    );
    next();
};


app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestMiddleware);
app.use('/', routers);

// 테스트용
app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요!');
});