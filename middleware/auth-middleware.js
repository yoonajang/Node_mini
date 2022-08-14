const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");
    console.log(authorization)

    if (!authToken || authType !== "Bearer") {
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }
 
    try {
        // // 원래
        // const { userId } = jwt.verify(authToken, process.env.TOKEN); // userId = 아이디

        // console.log({id},typeof id, "auth: id 확인")
        // console.log(authToken, "auth: authToken 확인")

        // User.findOne({where: { id },}).then((userInfo) => {
        //     console.log("읽혀줄래?")
        //     res.locals.user = userInfo;
        //     next();
        // });

        // 수정본
        console.log("시작")
        const { userId } = jwt.verify(authToken, process.env.TOKEN);

        console.log(userId,typeof userId, "auth: userId 확인")
        console.log(authToken, "auth: authToken 확인")


        User.findByPk(userId).then((user) => {
                res.locals.user = user;
                next();
            });
  
    } catch (error) {          
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.2",
        });
        return;
    }
};