var mongoose = require('mongoose')

var database = {}   //db,schema,model

//app : 익스프레스 서버
database.init = function(app,config){

    connect(app,config)

}

function connect(app,config){

    console.log('connect() 호출됨')

    //데이타베이스 연결
    mongoose.connect(config.dbUrl)
    database = mongoose.connection      //conn

     //on : 정해진 이벤트
    database.on('open',function(){

        console.log('데이터베이스에 연결되었습니다 : ' + config.dbUrl)

        createSchema(app,config)
       
    })

    database.on('error',console.error.bind(console,'몽구스 연결 에러'))
    database.on('disconnected',function(){
        console.log('데이터베이스 연결이 끊어졌습니다.')
        setInterval(connectDB(),5000)
    })

}


function createSchema(app,config){
    var schemaLen = config.dbSchemas.length //1

    for(var i=0; i<schemaLen; i++){

        var curItem = config.dbSchemas[i]

        //스키마 생성
        var curSchema = require(curItem.file).createSchema(mongoose)
        console.log('UserSchema 정의함')

        //모델 생성
        var curModel = mongoose.model(curItem.collection,curSchema)
        console.log('UserModel 생성됨')

        database[curItem.schemaName] = curSchema    //database에 스키마 추가
        database[curItem.modelName] = curModel      //database에 모델 추가

        app.set('database',database)
    }
}

module.exports = database