//로그인
//Passport Strategy방식
var LocalStrategy = require('passport-local').Strategy

module.exports = new LocalStrategy({

    usernameField : 'email',
    passwordField : 'pwd',
    //아래 콜백함수의 첫번째 파라미터로 req객체가 전달됨
    passReqToCallback : true

    },function(req,email,pwd,done){

        var database = req.app.get('database')

        database.UserModel.findOne({email:email},function(err,user){

            if(err) throw err

            if(!user){

                console.log('등록된 계정이 없습니다')

                return done(null,false,
                    req.flash('loginMessage','등록된 계정이 없습니다')
                )
            }

            //비밀번호가 틀린경우
            var authenticate =
                user.authenticate(pwd,user._doc.salt,user._doc.hashed_password)
            
            if(!authenticate){

                console.log('비밀번호가 일치하지 않음')

                return done(null,false,
                    req.flash('loginMessage','비밀번호가 일치하지 않습니다')
                )

            }

            console.log('계정과 비밀번호가 일치함')

            return done(null,user)

        })
    }
)