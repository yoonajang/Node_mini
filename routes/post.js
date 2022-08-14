const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Post } = require("../models");
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth-middleware');

// 메인페이지 (글전체조회)
router.get('/main', async (req, res) => {

    console.log(userId, nickname, password, passwordCheck)

    // if (password !== passwordCheck) {
    //     res.status(400).send({ message: "fail"});
    //     return;
    //   }

    // // userId or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    // const existsUsers = await User.findAll({
    //     where: {
    //     [Op.or]: [{ userId }, { nickname }],
    //     },
    // });
    // if (existsUsers.length) {
    //     res.status(400).send({ message: "fail"});
    //     return;
    // }

    // await User.create({ userId, nickname, password });
    // res.status(201).send({message: "true"});
});

// 게시글 작성 (authMiddleware)
router.post('/write', async (req, res) => {
    const { title, content } = req.body;

    // if (password !== passwordCheck) {
    //     res.status(400).send({ message: "fail"});
    //     return;
    //   }

    // // userId or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    // const existsUsers = await User.findAll({
    //     where: {
    //     [Op.or]: [{ userId }, { nickname }],
    //     },
    // });
    // if (existsUsers.length) {
    //     res.status(400).send({ message: "fail"});
    //     return;
    // }

    const postId = await User.create({ userId, nickname, password });
    const post = Post.findOne({where: {postId},},)
    res.status(201).send({message: "true", post });
});

module.exports = router;