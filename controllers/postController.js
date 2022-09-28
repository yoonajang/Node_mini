const { Op } = require("sequelize");
const { Posts, Comments, Likes, Images } = require("../models");

// 이미지
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

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
        Posts.findAll().then(post => {
        res.status(201).send({message: "true", post });})

    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

// 게시글 조회 (하나만) + 코멘트 조회
const getOnePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const is_saved = true;
        
        const post = await Posts.findOne({where: {postId, is_saved}})
        const comment = await Comments.findAll({where: {postId}})

        // 게시글에서 찾았는데 없는경우 실패알림
        if (!post) {
            return res.status(400).send({message: "fail: 해당 게시글이 없습니다."})
        }

        res.status(200).send({message: "true", post, comment });

    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};

// 게시글 작성 (조건 추가하기)
const writePost = async (req, res) => {
    try {
        const { user } = res.locals
        const { title, content } = req.body;
        const writer = user.nickname;
        const is_saved = true;

        const samePost = await Posts.findOne({where: {title, content, writer}})
        console.log(samePost, 'null 인가요?')
        
        if(samePost){
            // DB에 동일한 제목, 내용이 임시 저장된 경우, 저장 완료
            if(samePost.is_saved == false){
                await Posts.update({is_saved},{where: {title, content, writer}})
            }
            // DB에 동일한 제목, 내용, 작성자인 경우, 에러발생
            if(samePost.is_saved == true){
                return res.status(400).send({message: "fail: 중복된 게시글이 있습니다."})
            }
        }
        const newPost = await Posts.create({ title, content, writer });
        await Posts
            .findOne({where: {postId: newPost.postId}})
            .then(post => {
                res.status(201).send({message: "true", post });})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};


// 게시글 임시저장
const tempWritePost = async (req, res) => {
    try {
        const { user } = res.locals
        const { title, content } = req.body;

        const writer = user.nickname;
        const is_saved = false;

        const samePost = await Posts.findOne({where: {title, content, writer, is_saved}})


        // DB에 동일한 제목, 내용, 작성자인 경우, 에러발생
        if(samePost){
            return res.status(400).send({message: "fail: 임시 저장된 게시글이 있습니다.", post: samePost})
        }

        const newPost = await Posts.create({ title, content, writer, is_saved });
        await Posts
            .findOne({where: {postId: newPost.postId}})
            .then(post => {
                res.status(201).send({message: "true", post });})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};
    


// 게시글 수정
const editPost = async (req, res) => {
    try {
        const { user } = res.locals
        const { postId, title, content } = req.body;

        const post = await Posts.findOne({where: {postId}})

        // 게시글에서 찾았는데 없는경우 실패알림
        if (!post) {
            return res.status(400).send({message: "fail: 게시글이 없습니다."})
        }

        // 로그인 작성자와 게시물 작성자가 다른 경우 실패알림
        if(post.writer != user.nickname){
            return res.status(400).send({message: "fail: 작성자가 아닙니다."})
        }

        await Posts.update({title, content}, {where: {postId}})
        await Posts.findOne({where: {postId}})
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
        const { postId } = req.params;

        const post = await Posts.findOne({where: {postId}})

        // 게시글에서 찾았는데 없는경우 실패알림
        if (!post) {
            return res.status(400).send({message: "fail: 게시글이 없습니다."})
        }

        // 로그인 작성자와 게시물 작성자가 다른 경우 실패알림
        if(post.writer != user.nickname){
            return res.status(400).send({message: "fail: 작성자가 아닙니다."})
        }

        await Posts.destroy({ where: {postId} })
            .then(res.status(200).send({message: "true"}))
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};

// 좋아요
const likePost = async (req, res) => {
    try {
        const { user } = res.locals
        const { postId } = req.params;

        await Likes.findOne({where: {postId, userId: user.userId}}).then((like) => {  
            if(!like) {
                Likes.create({postId, userId: user.userId})
            } else {
                Likes.destroy({where: {postId, userId: user.userId}})

            }
        })

        return res.status(200).send({message: "true"})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};


// 공유하기 (보류)
const sharePost = async (req, res) => {
    try {
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

// 검색 조회
const searchPost = async (req, res) => {
    try {
        const { word } = req.query;

        const post = await Posts.findAll({
            where: {
                [Op.or]: [
                    { title: {[Op.like]: '%' + word + '%'},},
                    { content: {[Op.like]: '%' + word + '%'},},
                ]
            }
        })       

        return res.status(200).send({message: "true", post})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};

// 최신글 조회
const recentPost = async (req, res) => {
    try {       
        const post = await Posts.findAll({
            where:{is_saved:true},
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).send({message: "true", post})
    } catch (error) {
        res.status(400).send({ message: "fail"});
    }
};

// 마이페이지 조회
const myPage = async (req, res) => {
    try {
        const { user } = res.locals;
   
        const post = await Posts.findAll({
            where:{writer : user.nickname, is_saved : true },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).send({message: "true", user, post})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};

// 이미지 업로드
const uploadImage = async (req, res) => {
    try {
        const {postId} = req.params;
        const image = req.file;
        console.log(image);
        await Images.create({ imageUrl: image.location, postId });
        
        return res.status(200).send({message: "true"})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail"});
    }
};

// 이미지 제거
const deleteImage = async (req, res) => {
    try {
    const { image_id } = req.params;
    const existImage = await Images.findByPk(image_id);
    console.log

    if (existImage) {
      // 모든 DB에서 이미지 삭제 코드 작성 추가!!!!

      const photoFileURL = existImage.imageUrl;

      console.log(photoFileURL)
      const deleteImageFile = photoFileURL.split('/')[4];
      const keyURL = 'image/' + decodeURI(deleteImageFile).replace('+', ' ');
      console.log(keyURL)
      s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: keyURL,
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
      await Images.destroy({ where: { ImageId: existImage.ImageId } });

      return res.status(200).send({message: "true"})
    }
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "fail :" + error.message});
    }
};


module.exports = {
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
};
