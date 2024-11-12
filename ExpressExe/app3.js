require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')

var serveStatic = require('serve-static')
//중간 주소를 적을 수 있도록 해 주는 패스

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT)

app.use(express.urlencoded({extended:true}))    //post 방식을 허용하겠다.

//templates 폴더를 루트패스로 접근
app.use(serveStatic(path.join(__dirname,'templates')))

app.use(function(req,res,next){
    console.log('POST 미들웨어에서 요청을 처리함')

    //Get 방식 : req.query.name
    //Post 방식 : req.body.name
    //Get/Post 방식 : req.param('name')

    var id = req.body.id
    var pwd = req.body.pwd

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>')
    res.write('<div>id : ' + id + '</div>')
    res.write('<div>pwd : ' + pwd + '</div>')
    res.end()
})


//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))
})
