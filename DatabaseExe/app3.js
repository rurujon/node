require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
//var MongoClient = require('mongodb') .MongoClient

//mongoose 모듈
var mongoose = require('mongoose')

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

        //스키마 정의
        UserSchema = mongoose.Schema({
            id:{type:String,required:true,unique:true},
            name:{type:String,index:'hashed'},
            password:{type:String,required:true},
            age:{type:Number,'default':20},
            created:{type:Date,index:{unique:false},'default':Date.now}
        })

        //스키마 객체에 메소드 추가(static(),method())
        UserSchema.static('findById',function(id,callback){
            return this.find({id:id},callback)
        })

        UserSchema.static('findAll',function(callback){
            return this.find({},callback)
        })

        console.log('UserSchema 정의함')

        //모델 정의
        UserModel = mongoose.model('users2',UserSchema)
        console.log('UserModel 정의함')
    })

    database.on('error',console.error.bind(console,'몽구스 연결 에러'))
    database.on('disconnected',function(){
        console.log('데이터베이스 연결이 끊어졌습니다.')
        setInterval(connectDB(),5000)
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

//---------------------------------------------------------------------

//코드 추가
//사용자를 인증하는 함수
var authUser = function(database,id,pwd,callback){

    UserModel.findById(id,function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result.length>0){

            console.log('아이디가 일치하는 사용자 검색됨')

            //패스워드 비교
            if(result[0]._doc.password===pwd){

                console.log('비밀번호가 일치함')
                callback(null,result)
            }else{
                console.log('비밀번호가 일치하지 않음')
                callback(null,null)
            }

        }else{
            console.log('일치하는 사용자를 찾지 못했습니다.')
            callback(null,null)
        }

    })

}

//사용자를 추가하는 함수
var addUser = function(database,id,pwd,name,callback){

    //UserModel 인스턴스 생성
    var user = new UserModel({id:id,password:pwd,name:name})
    user.save(function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result){
            console.log("사용자 추가됨")
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

            if(result){

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

router.route('/process/listUser').post(function(req,res){

    console.log('/process/listUser 호출됨')

    if(database){

        UserModel.findAll(function(err,result){

            if(err){
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h2>사용자 리스트 조회 에러</h2>')
                res.end()

                return

            }

            if(result){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h2>사용자 리스트</h2>')
                res.write('<div><ul>')

                for(var i=0;i<result.length;i++){
                    var id = result[i]._doc.id
                    var name = result[i]._doc.name
                    var age = result[i]._doc.age

                    res.write('<li>#' + (i+1) + ' : '
                    + id + ', ' + name + ', ' + age + '</li>')
                }

                res.write('</ul></div>')
                res.write("<br/><br/><a href='/public/listUser.html'>리스트</a>")
                res.end()

            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<h2>사용자 리스트 조회 실패</h2>')
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
