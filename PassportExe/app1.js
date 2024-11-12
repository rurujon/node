require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var config= require('./config')
var database = require('./database/database')
var routerLoader = require('./router/routerLoader')

var passport = require('passport')
var flash = require('connect-flash')//사용자에게 메세지를 전달

//Express 객체 생성
var app = express()

//뷰엔진 설정
app.set('views',__dirname + '/views')
app.set('view engine','ejs')
console.log('뷰엔진이 ejs로 설정되었습니다')

app.set('port',process.env.PORT||config.serverPort)

app.use(express.urlencoded({extended:true})) 

//templates폴더를 웹서버의 루트패스로 접근
app.use('/public',serveStatic(path.join(__dirname,'templates')))

//cookie 미들웨어로 등록
app.use(cookieParser())

//세션 설정
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}))

//Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


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


//라우팅함수 등록
var router = express.Router()
routerLoader.init(app,router)

//홈화면조회
router.route('/').get(function(req,res){
    res.render('index.ejs')
})

//로그인화면조회	/login(get)	
router.route('/login').get(function(req,res){
    res.render('login.ejs',{message:req.flash('loginMessage')})
})

//로그인요청	/login(post)	
router.route('/login').post(passport.authenticate('local-login',{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
}))

//회원가입조회	/signup(get)
router.route('/signup').get(function(req,res){
    res.render('signup.ejs',{message:req.flash('signupMessage')})
})

//회원가입요청	/signup(post)
router.route('/signup').post(passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
}))

//사용자프로필	/profile(get)	
router.route('/profile').get(function(req,res){
    if(!req.user){
        console.log('사용자 로그인이 안된 상태임')
        res.redirect('/')
        return
    }

    console.log('사용자가 로그인이 된 상태임')  
    if(Array.isArray(req.user)){
        res.render('profile.ejs',{user:req.user[0]._doc})
    }else{
        res.render('profile.ejs',{user:req.user})
    }

})

//로그아웃요청	/logout(get)	
router.route('/logout').get(function(req,res){
    req.logout(function(err){
        if(err) throw err
    })

    res.redirect('/')
})


//로그인
//Passport Strategy방식
var LocalStrategy = require('passport-local').Strategy

passport.use('local-login',new LocalStrategy({

    usernameField : 'email',
    passwordField : 'pwd',
    //아래 콜백함수의 첫번째 파라미터로 req객체가 전달됨
    passReqToCallback : true

    },function(req,email,pwd,done){

        var database = app.get('database')

        database.UserModel.findOne({email:email},function(err,user){

            if(err) throw err

            if(!user){

                console.log('등록된 계정이 없습니다')

                return done(null,false,
                    req.flash('loginMessage','등록된 계정이 없습니다')
                )
            }

            //비밀번호가 틀린경우
            var authenticate =
                user.authenticate(pwd,user._doc.salt,user._doc.hashed_password)
            
            if(!authenticate){

                console.log('비밀번호가 일치하지 않음')

                return done(null,false,
                    req.flash('loginMessage','비밀번호가 일치하지 않습니다')
                )

            }

            console.log('계정과 비밀번호가 일치함')

            return done(null,user)

        })
    }))

//회원가입
passport.use('local-signup',new LocalStrategy({

    usernameField : 'email',
    passwordField : 'pwd',
    passReqToCallback : true

    },function(req,email,pwd,done){

        var name = req.body.name

        //findOne 메소드가 block되는것을 방지
        process.nextTick(function(){

            var database = app.get('database')

            database.UserModel.findOne({email:email},function(err,user){

                if(err) throw err

                if(user){//회원이 가입되어있는 경우

                    console.log('회원 가입이 되어 있습니다')

                    return done(null,false,
                        req.flash('signupMessage','계정이 이미 있습니다'))

                }else{//계정이 없을때

                    var user = new database
                        .UserModel({email:email,password:pwd,name:name})
                    
                        user.save(function(err){
                            if(err) throw err

                            console.log('사용자 데이터 추가됨')

                            return done(null,user)
                        })
                }
            })
        })
    }))



//에러처리
var errorHandler = expressErrorHandler({
    static:{
        '404': './templates/404.html'
    }
})

app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

var host = '192.168.16.24'

//Express 서버 시작
http.createServer(app).listen(app.get('port'),host,function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))

    //데이터베이스 연결 함수 호출
    database.init(app,config)
})
