//os
var os = require('os')

console.log(os.hostname())
console.log(os.freemem() + ':' + os.totalmem())
console.log(os.cpus())
console.log(os.networkInterfaces())

console.log('------------------')

//path
var path = require('path')

var dir = ['users','itwill','docs']
var docDir = dir.join(path.sep)
console.log(docDir)

var curPath = path.join('/users/itwill','notepad.exe')
console.log(curPath)

var filePath = 'c:\\users\\itwill\\notepad.exe'

var dirName = path.dirname(filePath)
var fileName = path.basename(filePath)
var extName = path.extname(filePath)

console.log(dirName + ":" + fileName + ":" + extName)

