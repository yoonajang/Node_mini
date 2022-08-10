
const express = require('express');
const router = express.Router();

const userRouter = require('./user');

// 앞에 /로 시작됨
router.use('/user', userRouter);



module.exports = router;