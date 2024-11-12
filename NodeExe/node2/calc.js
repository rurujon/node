
var Calc = function(){

    this.on('stop', function(){
        console.log('test3에서 stop event 받음')
    })
}

//util.inherits : 상속을 가능하게 하는 모듈
var util = require('util')

//EventEmitter는 events 모듈 안에 정의되어 있다.
var eventEmitter = require('events').EventEmitter

//Calc가 이벤트를 처리할 수 있도록 EventEmitter를 상속
//public class Calc extends EventEmitter{}
util.inherits(Calc,eventEmitter)

module.exports = Calc;
module.exports.title = '계산기'