const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth-middleware');


// 암호화, 회원가입시 기준 필요
// 회원가입 
router.post('/signup', async (req, res) => {
    const { userId, nickname, password, passwordCheck } = req.body;

    console.log(userId, nickname, password, passwordCheck)

    if (password !== passwordCheck) {
        res.status(400).send({ message: "fail"});
        return;
      }

    // userId or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
        where: {
        [Op.or]: [{ userId }, { nickname }],
        },
    });
    if (existsUsers.length) {
        res.status(400).send({ message: "fail"});
        return;
    }

    await User.create({ userId, nickname, password });
    res.status(201).send({message: "true"});
});


// 로그인
router.post("/login", async (req, res) => {
    const { userId, password } = req.body;
    
    const user = await User.findOne({
      where: {
        userId,
      },
    });
    
    console.log(userId, "로그인: user확인")

    if (!user || password !== user.password) {
        res.status(400).send({ message: "fail"});
        return;
    }

    // // 토큰 옵션 설정
    // const payload = { userId: user.userId };
    // const secret = process.env.TOKEN;
    // const options = {
    // issuer: "백엔드 개발자", // 발행자
    // expiresIn: "1d", // 날짜: $$d, 시간: $$h, 분: $$m, 그냥 숫자만 넣으면 ms단위
    // };

    // // 토큰 생성
    // let token = jwt.sign(payload, secret, options)
    let token = jwt.sign(
        { userId: user.id },
        process.env.TOKEN,
        {expiresIn: 86400,}) // expires in 24 hours 
    console.log(user.id, "로그인: user.id 확인")


    // res.cookie("x_auth", token)
    res.status(200)
        .json({
            message: "true",
            user: {
                userId : user.userId,
                nickname : user.nickname
            }, 
            token})
  });


// 로그인 여부확인
router.get("/islogin",authMiddleware, async (req, res) => {
    const { user } = res.locals;
    
    res.status(200)
        .json({
            message: "true",
            user: {
                userId: user.userId, 
                nickname: user.nickname
            }
    });

});


module.exports = router;
