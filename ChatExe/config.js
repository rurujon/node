module.exports = {
    serverPort:3000,
    dbUrl:'mongodb://127.0.0.1:27017/myDB',

    dbSchemas:[
        {file:'./userSchema',collection:'users4',schemaName:'UserSchema',modelName:'UserModel'},

    ],

    routeInfo:[
        
    ]
}