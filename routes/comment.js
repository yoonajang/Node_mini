const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

const {
    writeComment,
    editComment,
    deleteComment
} = require("../controllers/commentController");

// 코멘트 작성 (조건 추가하기)
router.post('/write', authMiddleware, writeComment)


// 코멘트 수정
router.patch('/edit', authMiddleware, editComment)


// 코멘트 삭제
router.delete('/delete', authMiddleware, deleteComment)

module.exports = router;