require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')

//cookie 모듈
var cookieParser = require('cookie-parser')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT)

app.use(express.urlencoded({extended:true}))    //post 방식을 허용하겠다.

//templates 폴더를 루트패스로 접근
app.use('/public',serveStatic(path.join(__dirname,'templates')))

//cookie 미들웨어 등록
app.use(cookieParser())

//라우터 객체
var router = express.Router()

//주소가 왔을 때(get로) 함수를 실행해라.
//쿠키보기
router.route('/process/showCookie').get(function(req,res){
//router.post('/process/login', function(req,res){

    console.log('/process/showCookie 요청을 처리함')

    res.send(req.cookies)
   
})

//쿠키만들기
router.route('/process/setUserCookie').get(function(req,res){

    console.log('/process/setUserCookie 요청을 처리함')

    //쿠키 생성
    res.cookie('user',{
        id:'suzi',
        name:'배수지',
        authorized:true
    })

    //redirect로 응답.
    res.redirect('/process/showCookie')

})

app.use('/',router)

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
})
