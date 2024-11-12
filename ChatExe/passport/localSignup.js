//Passport Strategy방식
var LocalStrategy = require('passport-local').Strategy

module.exports = new LocalStrategy({

    usernameField : 'email',
    passwordField : 'pwd',
    passReqToCallback : true

    },function(req,email,pwd,done){

        var name = req.body.name

        //findOne 메소드가 block되는것을 방지
        process.nextTick(function(){

            var database = req.app.get('database')

            database.UserModel.findOne({email:email},function(err,user){

                if(err) throw err

                if(user){//회원이 가입되어있는 경우

                    console.log('회원 가입이 되어 있습니다')

                    return done(null,false,
                        req.flash('signupMessage','계정이 이미 있습니다'))

                }else{//계정이 없을때

                    var user = new database
                        .UserModel({email:email,password:pwd,name:name})
                    
                        user.save(function(err){
                            if(err) throw err

                            console.log('사용자 데이터 추가됨')

                            return done(null,user)
                        })
                }
            })
        })
    }
)