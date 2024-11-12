var crypto = require('crypto')

var Schema = {}

Schema.createSchema = function(mongoose){

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

    return UserSchema


}

module.exports = Schema