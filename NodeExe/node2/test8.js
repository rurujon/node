var fs = require('fs')

var inName = './output.txt'
var outName = './output3.txt'

fs.exists(outName,function(fileName){

    if(fileName){
        fs.unlink(outName,function(err){
            if(err){throw err};

            console.log(outName + '삭제함')
        })
        return
    }
    var inFile = fs.createReadStream(inName,{flags:'r'})
    var outFile = fs.createWriteStream(outName,{flags:'w'})

    inFile.pipe(outFile)

    console.log('파일 복사 성공!')

})