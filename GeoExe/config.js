module.exports = {
    serverPort:3000,
    dbUrl:'mongodb://127.0.0.1:27017/myDB',

    dbSchemas:[
        {file:'./userSchema',collection:'users4',schemaName:'UserSchema',modelName:'UserModel'},

        {file:'./starSchema',collection:'starbucks',schemaName:'StarSchema',modelName:'StarModel'},

    ],

    routeInfo:[

        {file:'./starbucks',path:'/process/addStarbucks',method:'add',type:'post'},
        {file:'./starbucks',path:'/process/listStarbucks',method:'list',type:'post'},
        {file:'./starbucks',path:'/process/nearStarbucks',method:'findNear',type:'post'},
        {file:'./starbucks',path:'/process/withinStarbucks',method:'findWithin',type:'post'},
        {file:'./starbucks',path:'/process/circleStarbucks',method:'findCircle',type:'post'},
        {file:'./starbucks',path:'/process/nearStarbucks2',method:'findNear2',type:'post'},

    ]
}