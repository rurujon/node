var fs = require('fs')

//파일을 동기 방식으로 읽음.
var data = fs.readFileSync('../data.json','utf-8')

console.log(data)

console.log('동기화 방식으로 데이터 읽음.')