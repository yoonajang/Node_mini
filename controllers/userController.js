const Joi = require("joi");
const CryptoJS = require("crypto-js");
const { Op } = require("sequelize");
const { Users } = require("../models");
const jwt = require('jsonwebtoken');
const passport = require('passport');


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
        const existsUsers =await Users.findAll({
            where: {
            [Op.or]: [{ userId }, { nickname }],
            },
        })
        if (existsUsers.length) {
            return res.status(400).send({ message: "fail: 아이디 또는 닉네임 중복되었습니다."});
        }


        const newUser = await Users.create({ userId, nickname, password: hashPassword });

        await Users
            .findOne({where: {userId}})
            .then(userInfo => {
                console.log(userInfo, '회원가입 됬다')
                res.status(201)
                    .send({message: "true", 
                            user: {
                                userId: userInfo.userId,
                                nickname: userInfo.nickname, 
                                velogtitle:userInfo.velogtitle, 
                                email:userInfo.email, 
                                gitaddress: userInfo.gitaddress, 

                            }});})

    } catch (error) {
        console.log(error)
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

        console.log( userId, password, '회원가입')
        
        const user = await Users.findOne({
        where: {
            userId
        },
        });
        
        const existPassword = user.password
        const decryptPassword = CryptoJS.AES.decrypt(existPassword,process.env.keyForDecrypt);
        const originPassword = decryptPassword.toString(CryptoJS.enc.Utf8)

        if (!user || originPassword !== password) {
            return res.status(400).send({ message: "fail: 아이디 또는 비밀번호를 확인해주세요."});
        }

        // 토큰 생성
        const payload = { userId: user.userId };
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

// 카카오 로그인
const kakaoCallback = (req, res, next) => {
    try {
        console.log('userController통과중')
      passport.authenticate(
        'kakao', {  failureRedirect: '/'},
        async (err, user) => {
          if (err) return next(err);
            console.log(user, user.email, '회원 들어왔습니다.')

          const userInfo = await Users.findOne({
            where: {
                email: user.email
            },
            });
        
            // 회원 추가데이터가 없는 경우, 회원가입 유도
          if (!userInfo.gitaddress) {
            // return res.redirect('http://localhost:3000/api/user/setting');
            throw new Error('추가데이터 작성이 필요합니다.')
          }
  
        // 토큰 생성
        const payload = { userId: user.userId };
        const secret = process.env.TOKEN;
        const options = {
                        issuer: "miniProject_BE", 
                        expiresIn: "1d", };
        const token = jwt.sign( payload, secret, options ) 

        return res.status(200)
        .json({
            message: "true",
            user,
            token,
            });
        }
      )(req, res, next);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: 'fail: ' + error.message });
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

        res.status(200)
            .json({
                message: "true",
                user
        });
    } catch (error) {
        res.status(401).send({ message: "fail"});
    }
};


// 추가 데이터 조회
const getSetting = async (req, res) => {
    try {
        const { user } = res.locals;

        console.log(user)

        res.status(200)
            .json({
                message: "true",
                user
        });
    } catch (error) {
        res.status(401).send({ message: "fail"});
    }
};

// 추가 데이터 수정
const editSetting = async (req, res) => {

    try {
        const { user } = res.locals;
        const userId = user.userId;
        const {velogtitle, email, gitaddress} = req.body;
        
        await Users.update({velogtitle, email, gitaddress}, {where: {userId}})

        const newSetting = await Users.findOne(
            { where: {userId},
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }    
        },)

        res.status(200)
            .json({
                message: "true",
                user : newSetting
        });
    } catch (error) {
        res.status(401).send({ message: "fail"});
    }
};

module.exports = {
    signup, login, isLogin, getSetting, editSetting, kakaoCallback
};

