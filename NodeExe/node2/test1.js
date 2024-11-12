//url 모듈

var url = require('url')

//parse : 주소 문자열을 URL 객체로 만들기

var curURL = url.parse('https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query=%EB%A1%9C%EC%8A%A4%ED%8A%B8%EC%95%84%ED%81%AC')

var curStr = url.format(curURL)

console.log(curURL)
console.log(curStr)

console.log('------------------------')

var queryStr = require('querystring')

var param = queryStr.parse(curURL.query)

console.log(param.query)
console.log(queryStr.stringify(param))