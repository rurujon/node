var fs = require('fs')

fs.writeFile('./output.txt','Hello World!!', function(err){

    if(err){
        console.log(err)
    }

    console.log('output.txt 쓰기완료')

})