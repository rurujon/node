var http = require("http");

http.createServer(function handler(req,res){

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.write("<h3>안녕 NodeJS!!!</h3>");
    res.end();

}).listen(3000,'192.168.16.24');

console.log('Server Running at http://192.168.16.24:3000/');