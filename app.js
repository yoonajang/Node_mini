require('dotenv').config();
const express = require('express');
const cors = require('cors');



const app = express();

// 서버가 실행될 포트를 설정
app.set('port', process.env.PORT || 3000);

// 첫번째 인수로 주소를 넣지 않는다면, 모든 요청에서 실행되는 미들웨어
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
})

// 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 정의
// req: 요청에 관한 정보가 들어 있는 객체
// res: 응답에 관한 정보가 들어있는 객체
app.get('/', (req, res, next) => {
    //res.send('Hello, Express')
    //res.sendFile(path.join(__dirname, '/index.html'));
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})

// http 웹 서버와 동일
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});