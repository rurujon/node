var localLogin = require('./localLogin.js')
var localSignup = require('./localSignup.js')

module.exports = function(app,passport){

    //사용자 로그인(인증) 성공시 호출
    //사용자 정보를 이용해서 세션을 만듦
    passport.serializeUser(function(user,done){
       console.log('serializeUser 호출됨')
       done(null,user)
    })

    //사용자 로그인(인증)후 사용자의 요청시마다 호출
    //user:사용자 인증 성공시 serializeUser메소드을 이용해서 만들었던
    //세션 정보가 파라미터로 넘어온 것임
    passport.deserializeUser(function(user,done){
        console.log('deserializeUser 호출됨')
        done(null,user)
    })

    //인증방식 설정
    passport.use('local-login',localLogin)
    passport.use('local-signup',localSignup)

}