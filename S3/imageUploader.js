const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

const s3 = new AWS.S3();

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME + '/image', // 생성한 버킷 이름
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory ?? ''; // 업로드할 디렉토리 설정
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        // extension 확인을 위한 코드
        return callback(new Error('wrong extension'));
      }
      callback(null, `${Date.now()}_${file.originalname}`);
    },
    acl: 'public-read-write',
  }),
});


module.exports = imageUploader;
