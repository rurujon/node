//프로토타입 객체
//new로 객체를 생성
//var Person = {} 는 기본틀에 변수를 생성

function Person(name,age){
    this.name = name
    this.age = age

}

//Person.walk = function(speed){} -- X

Person.prototype.walk = function(speed){

    if(speed>30){
        console.log(speed + 'km로 달려갑니다')
        return
    }

    console.log(speed + 'km로 걸어갑니다')

}

var person1 = new Person('수지',29)
var person2 = new Person('인나',35)

console.log(person1.name + '가 걸어가고 있습니다.')
person1.walk(10)
console.log(person2.name + '가 뛰어가고 있습니다.')
person1.walk(50)