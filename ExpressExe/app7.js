require('dotenv').config()

//Express 모듈 호출
var express = require('express')
var http = require('http')
var path = require('path')
var serveStatic = require('serve-static')
var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')

//파일 업로드 모듈
var multer = require('multer')

//Express 객체 생성
var app = express()

//뒤에 숨겨놨다가 불러오는 기능이 있다.
app.set('port',process.env.PORT)

app.use(express.urlencoded({extended:true}))    //post 방식을 허용하겠다.

//templates 폴더를 루트패스로 접근
app.use('/public',serveStatic(path.join(__dirname,'templates')))
app.use('/upload',serveStatic(path.join(__dirname,'uploads')))

//storage 저장 기준 설정
var storageMethod = multer.diskStorage({

    //파일 저장 위치
    destination:function(req,file,callback){ //파일 저장 위치
        callback(null,'uploads')
    },
    filename:function(req,file,callback){    //파일 이름 설정
        var extension = path.extname(file.originalname)
        var basename = path.basename(encoding(file.originalname),extension)

        callback(null,basename+extension)   //abc.txt
        //callback(null,file.originalname)    //abc.txt
        //callback(null,basename + Date.now() + extension)  //abc23154564312.txt
        //callback(null,Date.now().toString + extension)  //32154678.txt

    }

})

//위에서 만든 storage를 기준으로 upload
var fileUpload = multer({
    storage:storageMethod,
    limits:{
        file:10,
        fileSize:1024*1024*1024 //1GB
    }
})

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
app.post('/process/file', fileUpload.array("upload",5) ,function(req,res){

    console.log('/process/file 요청을 처리함')

    try{

        var files = req.files;
        //console.log(req.files[0])

        //파일 정보를 저장할 변수
        var originalName = ''
        var fileName = ''
        var mimeType = ''
        var size = 0

        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write('<h1>파일업로드 성공</h1>')

        if(Array.isArray(files)){

            console.log(files.length + '개')

            for(var i=0;i<files.length;i++){
                originalName = encoding(files[i].originalname)
                fileName = files[i].filename
                mimeType = files[i].mimetype
                size = files[i].size

                res.write('<hr/>')
                res.write('<div>원본 파일명 : ' + originalName + '</div>')
                res.write('<div>저장 파일명 : ' + fileName + '</div>')
                res.write('<div>MimeType : ' + mimeType + '</div>')
                res.write('<div>파일 크기 : ' + size + '</div>')

            }
        }
            res.end()

        
    }   catch(err){
        console.log(err.static)
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

function encoding(fileName){
    return Buffer.from(fileName,'latin1').toString('utf-8')
}