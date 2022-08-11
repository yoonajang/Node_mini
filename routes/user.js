const express = require('express');
const router = express.Router();


router.post('/', async (req, res, next) => {

    res.send("<h1>Express server Start</h1>")
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