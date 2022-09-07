const express = require('express');
const router = express.Router();
const { Post } = require("../models");
const { Comment } = require("../models"); 
const authMiddleware = require('../middleware/auth-middleware');

// 메인페이지 (글전체조회)
const getPost = (req, res) => {

    /*========================================================================================================
    /* 	#swagger.tags = ['Post']
        #swagger.summary = '게시글 전체조회'
        #swagger.description = '게시글 전체조회' */

    /*  #swagger.responses[200] =  {  
            description: '게시글 조회',
            schema: { "message" : "true",        
                        "posts": { "postId" : 1, 
                                    "title" : "제목",
                                    "content" : "내용입니다.",
                                    "writer" : "닉네임",
                                    "createdAt" : 2022-02-02,
                                    "updatedAt" : 2022-02-02 }}}

    /*  #swagger.responses[400] = { 
            description: '게시글 조회 실패',
            schema: { "message" : "fail" }}

    ========================================================================================================*/

    try {
        Post.findAll().then(post => {
        res.status(201).send({message: "true", post });})

    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

// 댓글 조회
const getComment = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await Post.findOne({where: {postId}})
        const comment = await Comment.findAll({where: {postId}})

        // 게시글에서 찾았는데 없는경우 실패알림
        if (!post || !comment) {
            return res.status(400).send({message: "fail: 해당 내용이 없습니다."})
        }

        res.status(200).send({message: "true", post, comment });

    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

// 게시글 작성 (조건 추가하기)
const writePost = async (req, res) => {
    try {
        const { user } = res.locals
        const { title, content } = req.body;
        const writer = user.userId

        const samePost = await Post.findOne({where: {title, content, writer}})
        console.log(samePost)

        // DB에 동일한 제목, 내용, 작성자인 경우, 에러발생
        if(samePost){
            return res.status(400).send({message: "fail: 중복된 게시글이 있습니다."})
        }

        const newPost = await Post.create({ title, content, writer });
        const newPostId = newPost.null
        await Post
            .findOne({where: {postId: newPostId}})
            .then(post => {
                res.status(201).send({message: "true", post });})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};
    


// 게시글 수정
const editPost = async (req, res) => {
    try {
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

        await Post.update({title, content}, {where: {postId}})
        await Post.findOne({where: {postId}})
            .then(post => {
                res.status(200).send({message: "true", post });})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};
        

// 게시글 삭제
const deletePost = async (req, res) => {
    try {
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
            .then(res.status(200).send({message: "true"}))
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

module.exports = {
    getPost, 
    getComment,
    writePost, 
    editPost,
    deletePost
};
