const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require('jsonwebtoken');
const user = require('../models/user');
// const authMiddleware = require('../middleware/auth-middleware');


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
  
    const userinfo = await User.findOne({
      where: {
        userId,
      },
    });
  

    if (!userinfo || password !== userinfo.password) {
        res.status(400).send({ message: "fail"});
        return;
    }

    // 토큰 생성
    let token = jwt.sign({ 
        id: userinfo.id, 
        nickname: userinfo.nickname 
    }, process.env.TOKEN)

    // 유저정보
    let user = {
        id : userinfo.id,
        userId : userinfo.userId,
        nickname : userinfo.nickname
    }

    res.cookie("x_auth", token)
        .status(200)
        .json({message : "true", user, token})
  });




module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../schemas/user")
// const Joi = require("joi")
// const bcrypt = require('bcrypt')
// const authMiddleware = require("../middlewares/auth");

// const router = express.Router();

// //  회원 가입 양식
// const registerSchema = Joi.object({
//     userId: Joi
//         .string()
//         .required()
//         .userId(new RegExp(/^[a-zA-Z0-9가-힣]{2,20}$/)),//영문(대소문자) 한글 숫자 2~20자
//     nickname: Joi
//         .string()
//         .required()
//         .pattern(new RegExp(/^[a-zA-Z0-9가-힣]{2,20}$/)),//영문(대소문자) 한글 숫자 2~20자
//     password: Joi
//         .string()
//         .required()
//         .pattern(new RegExp(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/)),//영문(대소문자) + 최소 1개의 숫자 혹은 특수 문자 8~20자
//     passwordCheck: Joi
//         .string()
//         .required()
// })


// //회원가입
// router.post("/api/user/signup", async (req, res) => {

//     // 에러 뱉는 함수
//     const returnError = (msg) => {
//         console.log("확인용")
//         res.status(400).send({ message: "fail"});
//     }

//     try {
//         const { userId, nickname, password, passwordCheck } = await registerSchema.validateAsync(req.body)
//         if (password.includes(nickname)) {
//             return returnError("사용자의 이름은 비밀번호에 사용할 수 없습니다.");
//         }
//         if (password !== passwordCheck) {
//             return returnError("비밀번호가 동일하지 않습니다.");
//         }  
//         const existId = await User.findOne({ email })
//         if (existId) {
//             return returnError("이미 사용 중인 이메일입니다.");
//         }         
//         const hashedPasword = await bcrypt.hash(password, 10)
//         const user = new User({ email, nickname, password: hashedPasword })
//         await user.save()

//         // console.log(user)

//         res.status(201).send({ message: "true" })
//     } catch (err) {
//         res.status(400).send({ message: "fail"})

//         return
//     }
// })


// //로그인, 토큰생성
// router.post("api/user/login", async (req, res) => {

//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     console.log(user)

//     if (!user) {
//         res.status(400).send({ message: "fail"})
//         return
//     } else {
//         const correctPassword = await bcrypt.compareSync(password, user.password)//hash 값과 req값을 비교해서 일치하면 true 출력
//         if (correctPassword) {
//             const token = jwt.sign({ email: user.email }, `${process.env.KEY}`);
//             const nickname = user.nickname;
//             const profileImg = user.profileImg;
//             res.status(200).send({
//                 message: "success",
//                 token,
//                 // email,
//                 // nickname,
//             })
//         } else {
//             res.status(400).send({ message: "fail"})
//         }
//     }
// })





// module.exports = router;