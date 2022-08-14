const express = require('express');
const router = express.Router();
const { Post } = require("../models");
const { Comment } = require("../models");
const authMiddleware = require('../middleware/auth-middleware');

// 메인페이지 (글전체조회)
router.get('/main', (req, res) => {

    // 동일한 IP가 1분내 20회이상 접속시, 에러발생 ( =====> 조건 추가하기)

    Post.findAll().then(post => {
        res.status(201).send({message: "true", post });})

});

// 댓글 조회
router.get('/main/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    
    const post = await Post.findOne({where: {postId}})
    const comment = await Comment.findAll({where: {postId}})

    await Comment.findAll({where: {postId}})
        .then(comment => {
            res.status(201).send({message: "true", post });})

});

// 게시글 작성 (조건 추가하기)
router.post('/write', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { title, content } = req.body;
    const writer = user.userId

    const samePost = await Post.findOne({where: {title, content, writer}})
    console.log(samePost)

    // DB에 동일한 제목, 내용, 작성자인 경우, 에러발생
    if(samePost){
        return res.status(400).send({message: "fail: 중복된 게시글이 있습니다."})
    }

    // 동일한 작성자가 1시간안에 20개 이상 작성시 에러발생( =====> 조건 추가하기)



    const newPost = await Post.create({ title, content, writer });
    const newPostId = newPost.null
    await Post
        .findOne({where: {postId: newPostId}})
        .then(post => {
            res.status(201).send({message: "true", post });})

});


// 게시글 수정
router.patch('/edit', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { postId, title, content } = req.body;

    const post = await Post.findOne({where: {postId}})

    // 게시글에서 찾았는데 없는경우 실패알림
    if (!post) {
        return res.status(400).send({message: "fail: 게시글이 없습니다."})
    }

    // 로그인 작성자와 게시물 작성자가 다른 경우 실패알림
    if(post.writer != user.userId){
        return res.status(400).send({message: "fail: 작성자가 아닙니다."})
    }

    Post
        .update({title, content}, {where: {postId}})
        .then(post => {
            res.status(200).send({message: "true", post });})


});

// 게시글 삭제
router.delete('/delete', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { postId } = req.body;

    const post = await Post.findOne({where: {postId}})

    // 게시글에서 찾았는데 없는경우 실패알림
    if (!post) {
        return res.status(400).send({message: "fail: 게시글이 없습니다."})
    }

    // 로그인 작성자와 게시물 작성자가 다른 경우 실패알림
    if(post.writer != user.userId){
        return res.status(400).send({message: "fail: 작성자가 아닙니다."})
    }

    await Post.destroy({ where: {postId} })
        .then(res.status(201).send({message: "true"}))
   
});



module.exports = router;