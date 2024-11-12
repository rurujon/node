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
     //스키마 정의
     UserSchema = mongoose.Schema({
        id:{type:String,required:true,unique:true},
        name:{type:String,index:'hashed'},
        hashed_password:{type:String,required:true},
        salt:{type:String,required:true},
        age:{type:Number,'default':20},
        created:{type:Date,index:{unique:false},'default':Date.now}
    })

    UserSchema
    .virtual('password')
    .set(function(password){
        this._password = password
        this.salt = this.makeSalt() //hi h...
        this.hashed_password = this.encryptPassword(password)    //암호화된 패스워드
    })
    .get(function(){
        return this_password
    })

    //salt값 생성 메서드
    UserSchema.method('makeSalt',function(){
        console.log('date : ' + new Date().valueOf()) //15728657955
        console.log('math : ' + Math.random())      //0.85614877865
        return Math.round((new Date().valueOf()*Math.random())) + ''
    })

    UserSchema.method('encryptPassword',function(inputPwd,inSalt){

        if(inSalt){     //로그인
            //'sha1' : 쉬바 : 읽는 방법 산업 표준
            return crypto.createHmac('sha1',inSalt)        
                .update(inputPwd).digest('hex')
        }else{          //회원가입
            return crypto.createHmac('sha1',this.salt)        
                .update(inputPwd).digest('hex')
        }

    })

    //로그인 할 때 암호화된 패스워드 비교
    UserSchema.method('authenticate',function(inputPwd,inSalt,hashed_password){

        if(inSalt){

            //사용자가 로그인시 입력한 pwd
            console.log('사용자가 입력한 pwd : ' + inputPwd)

            //사용자가 로그인시 입력한 pwd를 암호화
            console.log('사용자가 로그인시 입력한 암호화된 pwd : ' + this.encryptPassword(inputPwd,inSalt))

            //회원 가입 후 db에 저장되어 있는 암호화된 Pwd
            console.log('db에 저장되어있는 암호화된 pwd : ' + hashed_password)

            return this.encryptPassword(inputPwd,inSalt)==hashed_password
        }

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
    UserModel = mongoose.model('user3',UserSchema)
    console.log('UserModel 정의함')
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
//사용자를 로그인하는 함수
var authUser = function(database,id,pwd,callback){

    UserModel.findById(id,function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result.length>0){

            console.log('아이디가 일치하는 사용자 검색됨')

            var user = new UserModel({id:id})

            var authenticate =
                user.authenticate(pwd,result[0]._doc.salt,result[0]._doc.hashed_password)

            //패스워드 비교
            if(authenticate){

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
