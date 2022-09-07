const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

// 회원가입2
router.post("/signup", signup);

// 테스트 1
router.post("/test", test);

// 테스트 2
router.post("/test", test2);

// 로그인 유효성 검사
router.get("/islogin", authMiddleware, isLogin);

// 로그인
router.post("/login", login);

module.exports = router;

const { signup, login, isLogin } = require("../controllers/userController");
