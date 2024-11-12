require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
//var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')

var user = require('./router/user')

//암호화 모듈
var crypto = require('crypto')

//데이터베이스 객체 전역변수 선언
var database

//데이터베이스 스키마객체 전역변수 선언
var UserSchema  

//데이터베이스 모델객체 전역변수 선언.
//내가 만든 스키마를 어느 컬렉션에 적용할 것인가가 모델에 들어간다.
var UserModel

//데이터베이스 연결
function connectDB(){
    
    //데이타베이스 연결 정보
    var databaseUrl = 'mongodb://127.0.0.1:27017/myDB'

    //몽구스로 데이터베이스 연결 시도
    mongoose.connect(databaseUrl)

    database = mongoose.connection

    //on : 정해진 이벤트
    database.on('open',function(){

        console.log('데이터베이스에 연결되었습니다 : ' + databaseUrl)

        createUserSchema()
       
    })

    database.on('error',console.error.bind(console,'몽구스 연결 에러'))
    database.on('disconnected',function(){
        console.log('데이터베이스 연결이 끊어졌습니다.')
        setInterval(connectDB(),5000)
    })
}

function createUserSchema(){

    UserSchema = require('./database/userSchema').createSchema(mongoose)

    //모델 정의
    UserModel = mongoose.model('user3',UserSchema)
    console.log('UserModel 정의함')

    user.init(database,UserSchema,UserModel)
}

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT||3000)

app.use(express.urlencoded({extended:true}))    //post 방식을 허용하겠다.

//templates 폴더를 루트패스로 접근
app.use('/public',serveStatic(path.join(__dirname,'templates')))

//cookie 미들웨어 등록
app.use(cookieParser())

//세션 설정
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}))

//---------------------------------------------------------------------


//-----------------------------------------------------

//사용자 로그인 라우터
var router = express.Router()

router.route('/process/login').post(user.login)

//사용자 추가 라우터
router.route('/process/addUser').post(user.addUser)

router.route('/process/listUser').post(user.listUser)

app.use('/',router)


//에러처리
var errorHandler = expressErrorHandler({
    static:{
        '404': './templates/404.html'
    }
})

app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))

    //데이터베이스 연결함수 호출
    connectDB()
})
