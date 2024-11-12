
/*
배열 만들고 요소 추가하기

push() : 마지막에 데이터 추가
pop() : 마지막 데이터 삭제
unshift() : 맨앞에 데이터 추가
shift() : 맨앞에 데이터 삭제
splice() : 여러 데이터 추가/삭제
slice() : 잘라내서 새로운 배열 만들기
*/

var Users = [
    {name:'수지',age:29},
    {name:'민정',age:35}
]

Users.push({name:'윤정',age:38})

console.log(Users.length + '개')
console.log(Users[0].name)
console.log(Users[1].name)
console.log(Users[2].name)

console.dir(Users)

for(var i=0;i<Users.length;i++){
    console.log(Users[i].name + ':' + Users[i].age)
}

Users.forEach(function(item,index){
    console.log(index + ':' + item.name + ':' + item.age)
})

Users.splice(0,1)
for(var i=0; i<Users.length; i++){
    console.log(Users[i].name + ':' + Users[i].age)
}

console.log('------------------ 1 ------------------------')

var add = function(a,b){
    return a+b
}

Users.push(add)

console.log(Users[2](10,20))

console.log('------------------- 2 -----------------------')

Users.push({name:'지우',age:40})
Users.push({name:'이유',age:30})
for(var i=0; i<Users.length; i++){
    console.log(Users[i].name + ':' + Users[i].age)

}

console.log('------------------- 3 -----------------------')

Users.pop()
for(var i=0; i<Users.length; i++){
    console.log(Users[i].name + ':' + Users[i].age)
}

console.log('------------------- 4 -----------------------')

Users.shift()
for(var i=0; i<Users.length; i++){
    console.log(Users[i].name + ':' + Users[i].age)
}

console.log('------------------- 5 -----------------------')

Users.unshift({name:'윤선',age:39})
for(var i=0; i<Users.length; i++){
    console.log(Users[i].name + ':' + Users[i].age)
}

console.log('------------------- 6 -----------------------')

delete Users[1]
console.log(Users)

console.log('--------------------- 7 ---------------------')

Users.splice(1,0,{name:'수지',age:29})
console.log(Users)

console.log('------------------- 8 -----------------------')

Users.splice(2,1)
console.log(Users)

console.log('-------------------- 9 ----------------------')
var Users2 = Users.slice(1,3)
console.log(Users)
console.log(Users2)

console.log('-------------------- 10 ----------------------')
var User3 = Users.slice(1)
console.log(User3)