require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')

//mongodb 모듈
var MongoClient = require('mongodb') .MongoClient

//데이터베이스 객체 전역변수 선언
var database

//데이터베이스 연결
function connectDB(){
    
    //데이타베이스 연결 정보
    var databaseUrl = 'mongodb://127.0.0.1:27017/myDB'

    //데이터베이스 연결
    MongoClient.connect(databaseUrl,function(err,dbase){
        if(err) throw err

        console.log('데이터베이스에 연결되었습니다: ' + databaseUrl)

        //database 객체에 할당
        database = dbase.db('myDB')
    })
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

//코드 추가
//사용자를 인증하는 함수
var authUser = function(database,id,pwd,callback){

    //users 컬렉션 호출
    var users = database.collection('users')

    users.find({id:id,password:pwd}).toArray(function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result.length>0){
            callback(null,result)
        }else{
            console.log('일치하는 사용자를 찾지 못했습니다.')
            callback(null,null)
        }

    })

}

//사용자를 추가하는 함수
var addUser = function(database,id,pwd,name,callback){
    var users = database.collection('users')
    users.insertMany([{id:id,password:pwd,name:name}],function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result.insertedCount>0){
            console.log("사용자 추가됨 : " + result.insertedCount + " 명")
        }else{
            console.log('추가된 사용자 없음.')
        }

        callback(null,result)

    })
}
//-----------------------------------------------------

//사용자 로그인 라우터
var router = express.Router()

router.route('/process/login').post(function(req,res){

    console.log('/process/login 호출됨')

    var id = req.body.id
    var pwd = req.body.pwd

    if(database){

        authUser(database,id,pwd,function(err,result){

            if(err) throw err

            if(result){

                var userName = result[0].name
                //console.log(userName)

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h1>로그인 성공</h1>')
                res.write('<div>id : ' + id + '</div>')
                res.write('<div>name : ' + userName + '</div>')
                res.write("<br/><br/><a href='/public/login.html'>로그인</a>")
                res.end()
            }else{

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h1>로그인 실패</h1>')
                res.write('<div>아이디와 패스워드를 확인하세요.</div>')
                res.write("<br/><br/><a href='/public/login.html'>로그인</a>")
                res.end()

            }
        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write('<h1>데이터베이스 실패</h1>')
        res.write('<div>데이터베이스를 연결하지 못했습니다.</div>')
        res.end()
    }
})

//사용자 추가 라우터
router.route('/process/addUser').post(function(req,res){

    console.log('/process/addUser 호출됨')

    var id = req.body.id
    var pwd = req.body.pwd
    var name = req.body.name

    if(database){
        addUser(database,id,pwd,name,function(err,result){

            if(err) throw err;

            if(result && result.insertedCount>0){

                console.dir(result)

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h2>사용자 추가 성공</h2>')
                res.end()

            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h2>사용자 추가 실패</h2>')
                res.end()
            }


        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write('<h1>데이터베이스 실패</h1>')
        res.write('<div>데이터베이스를 연결하지 못했습니다.</div>')
        res.end()
    }
})

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
