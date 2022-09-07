const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const postRouter = require("./post");
const commentRouter = require("./comment");

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

module.exports = router;
