module.exports = function(router,passport){

    console.log('userPassport 호출됨')

    //홈화면조회
    router.route('/').get(function(req,res){
        res.render('index.ejs')
    })

    //로그인화면조회	/login(get)	
    router.route('/login').get(function(req,res){
        res.render('login.ejs',{message:req.flash('loginMessage')})
    })

    //로그인요청	/login(post)	
    router.route('/login').post(passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    }))

    //회원가입조회	/signup(get)
    router.route('/signup').get(function(req,res){
        res.render('signup.ejs',{message:req.flash('signupMessage')})
    })

    //회원가입요청	/signup(post)
    router.route('/signup').post(passport.authenticate('local-signup',{
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
    }))

    //사용자프로필	/profile(get)	
    router.route('/profile').get(function(req,res){
        if(!req.user){
            console.log('사용자 로그인이 안된 상태임')
            res.redirect('/')
            return
        }

        console.log('사용자가 로그인이 된 상태임')  
        if(Array.isArray(req.user)){
            res.render('profile.ejs',{user:req.user[0]._doc})
        }else{
            res.render('profile.ejs',{user:req.user})
        }

    })

    //로그아웃요청	/logout(get)	
    router.route('/logout').get(function(req,res){
        req.logout(function(err){
            if(err) throw err
        })

        res.redirect('/')
    })

}