/*
**********************************************************
* 외부 모듈 설치하기(npm)
**********************************************************
package.json 파일생성
npm init 실행 (기본 외부모듈 설치-기본값 엔터)

npm install 모듈이름 : 설치
npm uninstall 모듈이름 : 삭제
npm install -g npm : 모든 모듈 업데이트

npm install 모듈이름 --save : package.json 파일에 저장
npm install 모듈이름 --g(--global) : 전역 환경에 파일 저장
C:\Users\itwill\AppData\Roaming\npm\node_modules

npm install : package.json 파일에 기록된 모든패키지 설치

npm list : 설치된 패키지 정보
npm list -g : 전역환경에 설치된 정보
*/

//winston : 로그를 기록하는 모듈

var logger = require('./logger')
var fs = require('fs')

var inName = './output.txt'
var outName = './output3.txt'

fs.exists(outName,function(fileName){

    if(fileName){
        fs.unlink(outName,function(err){
            if(err){throw err};

            logger.info(outName + '삭제함')
        })
        return
    }
    var inFile = fs.createReadStream(inName,{flags:'r'})
    var outFile = fs.createWriteStream(outName,{flags:'w'})

    inFile.pipe(outFile)

    logger.info('파일 복사 성공!')

})