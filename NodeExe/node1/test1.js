/* 
* 전역 객체(이미 만들어진 클래스)와 메소드(그 안에 들어 있는)	
* console 객체의 메소드 종류(dir,time,timeEnd)	
* process 객체의 메소드 종류(argv, env, exit)
* exports 객체의 메소드 종류
*/

console.log('console-------------------');

let result = 0

console.time("계산시간")
for(var i=1;i<=100;i++){
    result+=i
}

console.timeEnd("계산시간")
console.log('1~100까지의 합 : ' + result)

console.log('console-------------------');

console.log('파일이름:' + __filename)
console.log('경로이름:' + __dirname)

var Person = {name:'배수지',age:29}
console.dir(Person)
console.log(Person)

console.dir(process.argv)
console.log('파라미터 갯수: ' + process.argv.length)

process.argv.forEach(function(item,index){
    console.log(index + ' : ' + item)
})
console.log('-------------------------------')

console.dir(process.env)
