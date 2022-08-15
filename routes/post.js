const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

const {
    getPost, 
    getComment,
    writePost, 
    editPost,
    deletePost
} = require("../controllers/postController");
  

// 메인페이지 (글전체조회)
router.get('/main', getPost)

// 댓글 조회
router.get('/main/:postId', authMiddleware, getComment)

// 게시글 작성 (조건 추가하기)
router.post('/write', authMiddleware, writePost)

// 게시글 수정
router.patch('/edit', authMiddleware, editPost)

// 게시글 삭제
router.delete('/delete', authMiddleware, deletePost)

module.exports = router;