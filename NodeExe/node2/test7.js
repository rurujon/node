var fs = require('fs')

//r,w,(r+w),a+(r+w 누적)
var inFile = fs.createReadStream('./output.txt',{flags:'r'})
var outFile = fs.createWriteStream('./output2.txt',{flags:'a+'})

inFile.on('data',function(str){
    console.log('파일 읽기 시작..')
    outFile.write(str)

})

inFile.on('end',function(){
    console.log('파일 읽기 종료')

    outFile.end(function(){
        console.log('파일 쓰기 완료')
    })
})