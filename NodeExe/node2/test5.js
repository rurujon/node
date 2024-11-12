var fs = require('fs')

//파일을 비동기 방식으로 읽음.
fs.readFile('../data.json','utf-8',function(err,data){

    console.log(data)

})


console.log('비동기화 방식으로 데이터 읽음.')