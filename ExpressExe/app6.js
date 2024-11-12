require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')

//session 모듈
var expressSession = require('express-session')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT)

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

//라우터 객체
var router = express.Router()


//router.route('/process/showCookie').get(function(req,res){
//router.post('/process/login', function(req,res){
app.post('/process/login', function(req,res){

    console.log('/process/login 요청을 처리함')

    var id = req.body.id
    var pwd = req.body.pwd

    if(req.session.user){

        console.log('이미 로그인 되어 있어서 상품페이지로 이동합니다.')
        res.redirect('/public/product.html')
    }else{

        if(id=='suzi' && pwd=='a123'){

            //세션을 저장
            req.session.user={
                id:id,
                name:'배수지',
                authorize:true
            }

            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            res.write('<h1>로그인 성공</h1>')
            res.write('<div>id : ' + id + '</div>')
            res.write('<div>pwd : ' + pwd + '</div>')
            res.write('<div>name : ' + req.session.user.name + '</div>')
            res.write("<br/><br/><a href='/process/product'>상품 페이지</a>")
            res.end()

        }else{

            console.log('아이디나 패스워드가 일치하지 않습니다.')
            res.redirect('/public/login3.html')
        }
    }
   
})


app.get('/process/product',function(req,res){

    console.log('/process/product 요청을 처리함')

    if(req.session.user){

        console.log('로그인 되어 있음.')
        res.redirect('/public/product.html')
    }else{
        console.log('로그인 먼저 하세요.')
        res.redirect('/public/login3.html')
    }

})

app.get('/process/logout',function(req,res){

    console.log('/process/logout 요청을 처리함')

    if(req.session.user){

        console.log('로그아웃 합니다.')

        //세션 삭제
        //req.session.destroy()

        req.session.destroy(function(err){

            if(err) throw err;

            console.log('세션을 삭제하고 로그아웃되었습니다.')
            res.redirect('/public/login3.html')
        })


    }else{

        console.log('로그인이 안 되어있습니다.')
        res.redirect('/public/login3.html')
    }
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
