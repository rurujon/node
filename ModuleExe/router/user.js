/*
var database
var UserSchema
var UserModel

var init = function(db,schema,model){

    console.log('init 호출됨')

    database = db
    UserSchema = schema
    UserModel = model
}
*/

var moment = require('moment')

//라우터 함수(3개)
var login = function(req,res){

    console.log('/process/login 호출됨')

    var id = req.body.id
    var pwd = req.body.pwd

    var database = req.app.get('database')

    if(database){

        authUser(database,id,pwd,function(err,result){

            if(err) throw err

            if(result){

                var userName = result[0].name
                //console.log(userName)

                //뷰 템플릿
                var context = {userId:id,userName:userName}

                //req.app.render('login.ejs',context,function(err,html){
                req.app.render('login_Success.jade',context,function(err,html){
                    if(err) throw err

                    console.log('rendered : ' + html)
                    res.end(html)
                })

            }else{

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                res.write('<h1>로그인 실패</h1>')
                res.write('<div>아이디와 패스워드를 확인하세요.</div>')
                res.write("<br/><br/><a href='/public1/login.html'>로그인</a>")
                res.end()

            }
        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
        res.write('<h1>데이터베이스 실패</h1>')
        res.write('<div>데이터베이스를 연결하지 못했습니다.</div>')
        res.end()
    }


}

var addUsers = function(req,res){

    console.log('/process/addUser 호출됨')

    var id = req.body.id
    var pwd = req.body.pwd
    var name = req.body.name

    var database = req.app.get('database')

    if(database){
        addUser(database,id,pwd,name,function(err,result){

            if(err) throw err;

            if(result){

                //var context = {title:'사용자 추가 성공(View - ejs)'}
                var context = {title:'사용자 추가 성공(View - jade)'}
                
                //req.app.render('addUser',context,function(err,html){
                req.app.render('addUser_Success',context,function(err,html){

                    if(err) throw err
                    res.end(html)
                })

            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                res.write('<h2>사용자 추가 실패</h2>')
                res.end()
            }


        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
        res.write('<h1>데이터베이스 실패</h1>')
        res.write('<div>데이터베이스를 연결하지 못했습니다.</div>')
        res.end()
    }


}

var listUser = function(req,res){

    console.log('/process/listUser 호출됨')

    var database = req.app.get('database')

    if(database){

        database.UserModel.findAll(function(err,result){

            if(err){
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                res.write('<h2>사용자 리스트 조회 에러</h2>')
                res.end()

                return

            }

            if(result){

                var context = {result:result,moment:moment}
                req.app.render('listUserResp_Success',context,function(err,html){

                    if(err) throw err

                    res.end(html)
                })

            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                res.write('<h2>사용자 리스트 조회 실패</h2>')
                res.end()
            }

        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
        res.write('<h1>데이터베이스 실패</h1>')
        res.write('<div>데이터베이스를 연결하지 못했습니다.</div>')
        res.end()
    }


}

//함수(2개)
//코드 추가
//사용자를 로그인하는 함수
var authUser = function(database,id,pwd,callback){

    database.UserModel.findById(id,function(err,result){

        if(err){
            callback(err,null)
            return
        }

        if(result.length>0){

            console.log('아이디가 일치하는 사용자 검색됨')

            var user = new database.UserModel({id:id})

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
    var user = new database.UserModel({id:id,password:pwd,name:name})
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

//module.exports.init = init
module.exports.login = login;
module.exports.addUser = addUsers;
module.exports.listUser = listUser;