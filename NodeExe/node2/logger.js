var winston = require('winston')
//윈스턴을 날짜별로 기록할 수 있게끔.
var winsonDaily = require('winston-daily-rotate-file')

var logger1 = winston.createLogger({

    //debug,info,notics,warning,error,crit,alert,emerg
    level:'info',
    format:winston.format.simple(),
    transports:[
        new (winston.transports.Console)({
            colorize:true
        }),
        new (winsonDaily)({
            filename:'./log/server_%DATE%.log',
            maxSize:'10m',
            datePattern:'YYYY-MM-DD HH-mm-ss'
        })
    ]
})

module.exports = logger1