require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')

//중간 주소를 적을 수 있도록 해 주는 패스
var serveStatic = require('serve-static')

//에러 핸들러
var expressErrorHandler = require('express-error-handler')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT)

app.use(express.urlencoded({extended:true}))    //post 방식을 허용하겠다.

//templates 폴더를 루트패스로 접근
app.use('/public',serveStatic(path.join(__dirname,'templates')))

//라우터 객체
var router = express.Router()

//주소가 왔을 때(POST로) 함수를 실행해라.
//router.route('/process/login').post(function(req,res){
router.post('/process/login', function(req,res){

    console.log('/process/login 요청을 처리함')

    //Get 방식 : req.query.name
    //Post 방식 : req.body.name
    //Get/Post 방식 : req.param('name')

    var id = req.body.id
    var pwd = req.body.pwd

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>')
    res.write('<div>id : ' + id + '</div>')
    res.write('<div>pwd : ' + pwd + '</div>')
    res.write("<br/><br/><a href='/public/login2.html'>로그인</a>")
    res.end()
})

app.use('/',router)

/*
//에러처리
app.all('*',function(req,res){
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>')
})
*/

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
