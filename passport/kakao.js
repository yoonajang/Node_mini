require('dotenv').config();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { Users } = require('../models');


module.exports = () => {
  passport.use(
    new KakaoStrategy( 
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.KAKAO_CALL_BACK_URL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(accessToken, refreshToken, '토큰 확인');
          const provider = profile.provider.toUpperCase();
          const provider_uid = profile.id;
          const profile_image_url = 'image_url';
          const email = profile._json.kakao_account.email;

          console.log("profile :", profile, provider, provider_uid, profile_image_url, email);

          // 1. 로그인시, 회원 조회
          const existUser = await Users.findOne({
            where: { provider, provider_uid },
          });

          // 2. 회원이 없는 경우
          if (!existUser) {
            const nickname = '닉네임';
            const userId = email.split('@')[0]
            const password = 'social'

            newUser = await Users.create({provider, provider_uid, userId, password, nickname, email})
            return done(null, newUser);
          }

          else if(!existUser.gitaddress){
            newUser = {
                userId: existUser.userId,
                nickname: existUser.nickname,
                email: existUser.email,
                velogtitle: existUser.velogtitle,
                gitaddress: existUser.gitaddress,
            }
            return done(null, newUser);

          }

          // 3. 회원이 있는 경우
          const user = {
            userId: existUser.userId,
            nickname: existUser.nickname,
            email: existUser.email,
            velogtitle: existUser.velogtitle,
            gitaddress: existUser.gitaddress,
          };
          return done(null, user);
          
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};