const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const { signup, login, isLogin, getSetting, editSetting } = require("../controllers/userController");

// 회원가입
router.post("/signup", signup);

// 로그인 유효성 검사
router.get("/islogin", authMiddleware, isLogin);

// 로그인
router.post("/login", login);

// 추가 데이터 조회
router.get("/setting",authMiddleware, getSetting);

// 추가 데이터 수정
router.post("/setting",authMiddleware, editSetting);

module.exports = router;
