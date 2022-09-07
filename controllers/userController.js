const express = require('express');
const router = express.Router();
const Joi = require("joi");
const CryptoJS = require("crypto-js");
const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth-middleware');


// 회원가입 유효성 검사
const userSchema = Joi.object({
    // 아이디 양식
    // 2-15자 / 숫자, 영어, 한국어와 언더스코어, 공백 허용 
    userId: Joi.string()
        .pattern(new RegExp("^[가-힣ㄱ-ㅎa-zA-Z0-9._ -]{2,15}$"))
        .required(),
    
    // 비빌번호 양식
    // 8~20 영문 대소문자
    // 최소 1개의 숫자 혹은 특수 문자를 포함해야 함
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)-_=+]).{8,20}"
        )
      )
      .required(),
    
    // 비밀번호 확인 양식
    passwordCheck: Joi.string(),

    // 닉네임 양식
    //2-15자 / 숫자, 영어, 한국어와 언더스코어, 공백 허용 
    nickname: Joi.string()
        .pattern(new RegExp("^[가-힣ㄱ-ㅎa-zA-Z0-9._ -]{2,15}$"))
        .required(),

});



// 회원가입 
const signup = async (req, res) => {
    /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '회원가입'
        #swagger.description = '회원가입' */

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: { "userId": "아이디", "password": "비밀번호", "passwordCheck": "비밀번호","nickname": "닉네임" }
    } 

    /*  #swagger.responses[201] =  {  
            description: '회원가입 성공',
            schema: { "message" : "true",        
                        "user": { "id": 1, "userId": "아이디", "nickname": "닉네임" }}}

    /*  #swagger.responses[400] = { 
            description: '회원가입 실패',
            schema: { "message" : "fail" }}

    ========================================================================================================*/
    try {

        const { userId, nickname, password, passwordCheck } =
        await userSchema.validateAsync(req.body);

        console.log(userId, nickname, password, passwordCheck)

        const hashPassword = CryptoJS.AES.encrypt(password, process.env.keyForDecrypt).toString();

        if (password !== passwordCheck) {
            return res.status(400).send({ message: "fail: 비밀번호가 다릅니다."});
        }

        // userId or nickname 중복 확인
        const existsUsers = await User.findAll({
            where: {
            [Op.or]: [{ userId }, { nickname }],
            },
        });
        if (existsUsers.length) {
            return res.status(400).send({ message: "fail: 아이디 또는 닉네임 중복되었습니다."});
        }


        const newUser = await User.create({ userId, nickname, password: hashPassword });
        const newUserId = newUser.null
        await User
            .findOne({where: {id: newUserId}})
            .then(userInfo => {
                res.status(201)
                    .send({message: "true", 
                            user: {
                                id: userInfo.id,
                                userId: userInfo.userId,
                                nickname: userInfo.nickname
                            }});})

    } catch (error) {
        res.status(400).send({ message: "fail"});
    }   

};


// 로그인
const login = async (req, res) => {
    /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '로그인'
        #swagger.description = '로그인' */

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: { "userId": "아이디", "password": "비밀번호" }
    } 

    /*  #swagger.responses[200] =  {  
            description: '로그인 성공',
            schema: { "message" : "true",        
                        "user": { "id": 1, "userId": "아이디", "nickname": "닉네임" }}}

    /*  #swagger.responses[400] = { 
            description: '로그인 실패',
            schema: { "message" : "fail" }}

    ========================================================================================================*/
    try {

        const { userId, password } = req.body;
        
        const user = await User.findOne({
        where: {
            userId,
        },
        });
        
        const existPassword = user.password
        const decryptPassword = CryptoJS.AES.decrypt(existPassword,process.env.keyForDecrypt);
        const originPassword = decryptPassword.toString(CryptoJS.enc.Utf8)

        if (!user || originPassword !== password) {
            return res.status(400).send({ message: "fail: 아이디 또는 비밀번호를 확인해주세요."});
        }

        // 토큰 생성
        const payload = { userId: user.id };
        const secret = process.env.TOKEN;
        const options = {
                        issuer: "miniProject_BE", 
                        expiresIn: "1d", };
        const token = jwt.sign( payload, secret, options ) 

        // res.cookie("x_auth", token)
        res.status(200)
            .json({
                message: "true",
                user: {
                    id: user.id,
                    userId : user.userId,
                    nickname : user.nickname
                }, 
                token})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};


// 로그인 유효성 검사
const isLogin = async (req, res) => {
    /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '로그인 유효성 검사'
        #swagger.description = '로그인 유효성 검사'

    /*  #swagger.responses[200] =  {  
            description: '로그인 유효성 검사 성공',
            schema: { "message" : "true",        
                        "user": { "id": 1, "userId": "아이디", "nickname": "닉네임" }}}

    /*  #swagger.responses[401] = { 
            description: '로그인 유효성 검사  실패',
            schema: { "message" : "fail" }}
    ========================================================================================================*/

    try {
        const { user } = res.locals;
        // console.log(user)
        
        res.status(200)
            .json({
                message: "true",
                user: {
                    id: user.id,
                    userId: user.userId, 
                    nickname: user.nickname
                }
        });
    } catch (error) {
        res.status(401).send({ message: "fail"});
    }
};

module.exports = {
    signup, 
    login,
    isLogin
};

