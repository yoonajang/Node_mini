const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

const { signup, login, isLogin } = require("../controllers/userController");

// 회원가입
router.post("/signup", signup);

// 로그인
router.post("/login", login);

// 로그인 유효성 검사
router.get("/islogin", authMiddleware, isLogin);

module.exports = router;

// a

// b

// c
