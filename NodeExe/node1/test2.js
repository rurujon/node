/*
모듈 나누는 방법(exports)

1. 객체를 사용(module.exports)
var calc = {}

calc.add=function(a,b){
    return a+b;
}

calc.mul=function(a,b){
    return a*b
}

module.exports = calc

-------------------------------------
2. 속성으로 분리(exports)

exports.add = function(a,b){
    return a+b
}

exports.mul = function(a,b){
    return a*b
}



*/

var calc = {}

calc.add = function(a,b){
    return a+b
}

console.log(calc.add(10,20))

//---------------
//calc1을 불러온다.

var calc1 = require('./calc1')
console.log(calc1.add(100,200))

//----

var calc2 = require('./calc2')
console.log(calc2.mul(10,20))