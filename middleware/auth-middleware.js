const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");
    // console.log(authorization)

    if (!authToken || authType !== "Bearer") {
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }
 
    try {
        const { userId } = jwt.verify(authToken, process.env.TOKEN);
        console.log( userId)
        Users.findOne({where: {userId}}).then((user) => {

                res.locals.user = {
                    userId : user.userId,
                    nickname: user.nickname, 
                    velogtitle: user.velogtitle,
                    email: user.email,
                    gitaddress: user.gitaddress
                }
                next();
            });
  
    } catch (error) {     
        console.log(error)     
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.2",
        });
        return;
    }
};