var http = require('http')
var fs = require('fs')

//웹 서버 객체를 생성
var server = http.createServer();
/*
var server = http.createServer(function(req,res){

    console.log('클라이언트 요청이 들어왔습니다.')

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write('<!DOCTYPE html>')
    res.write('<html>')
    res.write('<head>')
    res.write('<title>응답 페이지</title>')
    res.write('</title>')
    res.write('<body>')
    res.write('<h1>서버에서 응답받기 - Request</h1>')
    res.write('</body>')
    res.write('</html>')
    res.end()

})
*/
var host = '192.168.16.24'
var port = 3000
server.listen(port,host,50000,function(){
    console.log('웹 서버가 시작되었습니다' + port)
})

server.on('connection',function(socket){
    console.log('클라이언트가 접속했습니다 " ' + 
        socket.remoteAddress + ':' + socket.remotePort
    )
})

//클라이언트 요청 이벤트
server.on('request',function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.')

    var fileName = './image/angelina.png'

    fs.readFile(fileName,function(err,data){
        res.writeHead(200,{'Content-Type':'image/png;charset=utf-8'})
        res.write(data)
        res.end()
    })

})

//서버 종료 이벤트
server.on('close',function(req,res){
    console.log('서버가 종료됩니다.')
})