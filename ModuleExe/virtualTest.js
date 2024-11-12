//모듈
var mongodb = require('mongodb')
var mongoose = require('mongoose')

var database
var UserSchema
var UserModel

function connectDB(){

    var databaseUrl = 'mongodb://127.0.0.1:27017/myDB'

    mongoose.connect(databaseUrl)
    database = mongoose.connection

    database.on('open',function(){

        console.log('데이터베이스에 연결 되었습니다 : ' + databaseUrl)

        //schema,model
        createUserSchema()

        //데이터 추가
        insertData()
    })
}

connectDB();

function createUserSchema(){

    UserSchema = mongoose.Schema({
        id:{type:String},
        name:{type:String}

    })

    UserSchema
    .virtual('info')
    .set(function(info){
        //{'info':'suzi,배수지'}

        //데이터 처리작업
        var array = info.split(',')
        this.id = array[0]
        this.name = array[1] + '짱'
    })
    .get(function(){
        return this.id + ' ' + this.name
    })

    UserModel = mongoose.model('user3',UserSchema)

}

function insertData(){

    var user = new UserModel({'info':'suzi,배수지'})

    //model 객체의 메소드(save,update,remove,find)
    user.save(function(err){
        if(err) throw err
        
        console.log('사용자 데이터 추가')

        findAll()
    })

}

function findAll(){

    UserModel.find({},function(err,result){

        if(err) throw err
        
        if(result){

            for(var i=0; i<result.length; i++){
                console.log('id:%s, name:%s',result[i]._doc.id,result[i]._doc.name)
            }
        }
    })

}

/*
단방향 암호 : hello를 암호화하고 암호화된 데이터를 다시 hello로 변경 못시킴 
양방향 암호 : hello를 암호화하고 암호화된 데이터를 다시 hello로 변경 시킴 (복호화)

로그인 처리 : 진짜 비밀번호는 DB에 저장되지 않는다
대신 salt키와 합쳐진 암호화된 비밀번호와 salt키가 db에 저장되며,
비밀번호 비교는 입력한 비밀번호와 salt키가 합쳐진 비밀번호를 비교하여 처리한다.
*/