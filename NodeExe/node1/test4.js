/*
[자료형]
Boolean,Number,String,Undefined,null,Object
Undefined : 값을 할당하지않은 변수(단순히 값이 없음)
null : 존재하지 않는 값(의도적으로 값이 없음)

*/


//자바스크립트 객체 타입
var Person = {}

Person['name'] = '고윤정'
Person['age'] = 35
Person.mobile = '010-1234-5678'

console.log(Person.name)
console.log(Person.age)
console.log(Person.mobile)

console.log(Person['name'])
console.log(Person['mobile'])


console.log('--------------------------------')

function add1(a,b){
    return a+b
}

var result = add1(10,20)
console.log('add1:' + result)


console.log('--------------------------------')

var add2 = function(a,b){
    return a+b
}

var result = add2(20,30)
console.log('add2:' + result)

console.log('--------------------------------')

var Person1 = {}

Person1['name'] = '한민정'
Person1['age'] = 40
Person1.mobile = '010-2222-2222'
Person1.add3 = function(a,b){
    return a+b
}

console.log('add3 : ' + Person1.add3(30,40))

console.log('--------------------------------')

var add4 = function(a,b){
    return a+b
}

Person1['add4'] = add4

console.log('add4 : ' + Person1.add4(40,50))

console.log('--------------------------------')

var Person2 = {
    name:'유인나',
    age:43,
    add5:function(a,b){
        return a+b
    }
}

console.log('add5:' + Person2.add5(50,60))