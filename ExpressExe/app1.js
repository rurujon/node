//Express 모듈 호출
var express = require('express')
var http = require('http')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT||3000)


//요청처리 - 미들웨어
//익스프레스서버는 미들웨어(함수)로 처리를 되돌려준다
//router -> m/w 
//구분의 단위는 라우터다.

/*
* 미들웨어 : 하나의 독립된 함수(use 메소드로 설정)
* 로그를 남기는 간단한 기능을 함수로 만들어서
  use()메소드로 미들웨어로 등록 하면 모든 클라이언트 요청에 로그를 남김
  미들웨어가 여러개면 next()메소드로 다음 미들웨어로 넘김

* 클라이언트요청 -> 라우터(요청패턴 /     ) ->  미들웨어 #0 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /users) ->  미들웨어 #1 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /sales) ->  미들웨어 #2 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /account) ->미들웨어 #3 ->  클라이언트응답
*/

app.use(function(req,res,next){
    console.log('첫번째 미들웨어에서 요청을 처리함')



    req.user = 'suzi'
    //request.setAttribute("user","suzi")

    next()
})

app.use(function(req,res,next){

    console.log('두번째 미들웨어에서 요청을 처리함')

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.end('<h1>Express 서버에서 ' + req.user + ' 응답한 결과입니다.</h1>')

})

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express 서버를 시작했습니다: ' + app.get('port'))
})
