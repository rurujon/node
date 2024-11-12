//Express 모듈 호출
var express = require('express')
var http = require('http')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT||3000)


app.use(function(req,res,next){
    console.log('첫번째 미들웨어에서 요청을 처리함')

    var userAgent = req.header('User-Agent')

    //Get 방식 : req.query.name
    //Post 방식 : req.body.name
    //Get/Post 방식 : req.param('name')

    var name = req.query.name
    //var name = req.param('name')

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 ' + req.user + ' 응답한 결과입니다.</h1>')
    res.write('<div>User-Agent : ' + userAgent + '</div>')
    res.write('<div>name : ' + name + '</div>')
    res.end()
})


//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))
})
