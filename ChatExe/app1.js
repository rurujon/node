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

//클라이언트 다중 서버 접속 지원
var cors = require('cors')


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

//cors 미들웨어로 등록
app.use(cors())

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





//라우팅함수 등록
var router = express.Router()
routerLoader.init(app,router)

//패스포트 라우터
var userPassport = require('./router/userPassport')
userPassport(router,passport)


//Passport Strategy방식
var configPassport = require('./passport/passport')
configPassport(app,passport)





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
var server = http.createServer(app).listen(app.get('port'),host,function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))

    //데이터베이스 연결 함수 호출
    database.init(app,config)
})

var io = require('socket.io')(server)

//클라이언트가 웹소켓으로 연결했을 때 발생하는 가장 기본 이벤트
io.sockets.on('connection',function(socket){

    console.log('Connection Info : ',socket.request.connection._peername)
    //socket.request.connection._peername.address : IP
    //socket.request.connection._peername.port : port

    //2. 메세지를 받는 코딩(on 메서드)
    socket.on('message',function(message){

        console.log('message 이벤트 받았습니다')

        if(message.receiver =='ALL'){

            //echo 기능
            //클라이언트가 서버한테 돌을 던져서 서버에서 그걸 그대로 돌려준다

            //받은 message를 클라이언트에게 전송
            io.sockets.emit('message',message)
        }
    })

})
