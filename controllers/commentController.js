const express = require('express');
const router = express.Router();
const { Comment } = require("../models");
const authMiddleware = require('../middleware/auth-middleware');


// 코멘트 작성
const writeComment = async (req, res) => {
    try {
        const { user } = res.locals
        const { postId, comment } = req.body;
        const writer = user.userId

        const newComment = await Comment.create({ postId, comment, writer });
        const newCommentId = newComment.null
        await Comment
            .findOne({where: {commentId: newCommentId}})
            .then(comment => {
                res.status(201).send({message: "true", comment });})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
    
};


// 코멘트 수정
const editComment = async (req, res) => {
    try {
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

        let message = "true"

        await Comment.update({comment}, {where: {commentId}})
        await Comment.findOne({where: {commentId}})
                .then(comment => {
                    console.log(comment)
                    res.status(200).send({message, comment});})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
    
};
        

// 코멘트 삭제
const deleteComment = async (req, res) => {
    try {
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
    
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
    
};

module.exports = {
    writeComment,
    editComment,
    deleteComment
};
