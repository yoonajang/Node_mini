const express = require('express');
const router = express.Router();
const { Post } = require("../models");
const { Comment } = require("../models");
const authMiddleware = require('../middleware/auth-middleware');

// 코멘트 작성 (조건 추가하기)
router.post('/write', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { postId, comment } = req.body;
    const writer = user.userId

    // 동일한 작성자가 1시간안에 20개 이상 작성시 에러발생( =====> 조건 추가하기)

    const newComment = await Comment.create({ postId, comment, writer });
    const newCommentId = newComment.null
    await Comment
        .findOne({where: {commentId: newCommentId}})
        .then(comment => {
            res.status(201).send({message: "true", comment });})

});

// 코멘트 수정
router.patch('/edit', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { commentId, comment } = req.body;

    const commentInfo = await Comment.findOne({where: {commentId}})

    // 코멘트에서 찾았는데 없는경우 실패알림
    if (!commentInfo) {
        return res.status(400).send({message: "fail: 코멘트가 없습니다."})
    }

    // 로그인 작성자와 코멘트 작성자가 다른 경우 실패알림
    if(commentInfo.writer != user.userId){
        return res.status(400).send({message: "fail: 작성자가 아닙니다."})
    }

    console.log(comment, "코멘트")
    let message = "true"

    await Comment.update({comment}, {where: {commentId}})
    await Comment.findOne({where: {commentId}})
            .then(comment => {
                console.log(comment)
                res.status(200).send({message, comment});})


});

// 코멘트 삭제
router.delete('/delete', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { commentId } = req.body;

    const comment = await Comment.findOne({where: {commentId}})

    // 코멘트에서 찾았는데 없는경우 실패알림
    if (!comment) {
        return res.status(400).send({message: "fail: 코멘트가 없습니다."})
    }

    // 로그인 작성자와 게시물 작성자가 다른 경우 실패알림
    if(comment.writer != user.userId){
        return res.status(400).send({message: "fail: 작성자가 아닙니다."})
    }

    await Comment.destroy({ where: {commentId} })
        .then(res.status(200).send({message: "true"}))
   
});




module.exports = router;