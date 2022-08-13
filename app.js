require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routers = require('./routes');
const mysql = require("mysql2");
const fs = require('fs');
const app = express();
const port = 3000
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
app.use('/api', routers);

app.listen(port, () => console.log(`${port} 열림`));