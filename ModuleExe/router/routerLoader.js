var config = require('../config')
var routerLoader = {};

routerLoader.init = function(app,router){

    console.log('routerLoader,init 호출됨')

    return initRouters(app,router)
}

function initRouters(app,router){

    var infoLen = config.routeInfo.length

    for(var i=0;i<infoLen;i++){

        var curItem = config.routeInfo[i]

        var curModule = require(curItem.file)   //user.js

        //라우팅 주소 처리
        if(curItem.type=='get'){
            //router.route('/process/login').post(user.login)
            router.route(curItem.path).get(curModule[curItem.method])
        }else if(curItem.type=='post'){
            router.route(curItem.path).post(curModule[curItem.method])
        }else{
            router.route(curItem.path).post(curModule[curItem.method])
        }

        
    }

    app.use('/',router)
}

module.exports = routerLoader