const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

const {
    getPost, 
    getOnePost,
    writePost,
    tempWritePost, 
    editPost,
    deletePost,
    likePost,
    sharePost,
    searchPost,
    recentPost,
    myPage,
    uploadImage,
    deleteImage
} = require("../controllers/postController");
  

// 메인페이지 (글전체조회)
router.get('/main', getPost)

// 게시글 조회 (하나만) + 코멘트 조회
router.get('/main/:postId', getOnePost)

// 게시글 작성 (조건 추가하기)
router.post('/write', authMiddleware, writePost)

// 게시글 임시저장 (조건 추가하기)
router.post('/tempwrite', authMiddleware, tempWritePost)

// 게시글 수정
router.patch('/edit', authMiddleware, editPost)

// 게시글 삭제
router.delete('/delete/:postId', authMiddleware, deletePost)

// 좋아요
router.post('/like/:postId', authMiddleware, likePost)

// 공유 (보류)
router.post('/share', sharePost)

// 검색 조회
router.get('/search', searchPost)

// 최신글 조회
router.get('/recent', recentPost)

// 마이페이지 조회
router.get('/mypage',authMiddleware, myPage)

// 이미지 업로드
router.post('/image', uploadImage)

// 이미지 제거
router.delete('/image', deleteImage)

module.exports = router;