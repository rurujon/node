module.exports = {
    serverPort:3000,
    dbUrl:'mongodb://127.0.0.1:27017/myDB',

    dbSchemas:[
        {file:'./userSchema',collection:'user3',schemaName:'UserSchema',modelName:'UserModel'},

    ],

    routeInfo:[
        {file:'./user',path:'/process/login',method:'login',type:'post'},
        {file:'./user',path:'/process/addUser',method:'addUser',type:'post'},
        {file:'./user',path:'/process/listUser',method:'listUser',type:'post'},

        {file:'./test',path:'/process/test',method:'testJade',type:'post'}
    ]
}