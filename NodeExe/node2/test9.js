var fs = require('fs')
/*
fs.mkdir('./doc',function(err){
    if(err) throw err

    console.log('doc 폴더 생성')
})
*/
fs.rmdir('./doc',function(err){
    if(err) throw err

    console.log('doc 폴더 삭제')
})