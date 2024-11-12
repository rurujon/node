//이벤트
//EventEmitter : 이벤트를 주고받는 객체
//process : 내부적으로 EventEmitte를 상속 받음
//  on : 실행할 작업(이벤트) 를 기록
//  emit():작업(이벤트) 호출

process.on('exit',function(){
    console.log('exit 이벤트가 발생함')
})

setTimeout(function(){
    console.log('4초 후에 이벤트 호출함')

    process.exit()
},4000)

process.on('tick',function(count){
    console.log('2초후에 tick 이벤트 호출함' + count)
})

setTimeout(function(){
    console.log('2초 후에 tick 이벤트 호출함.')
    process.emit('tick','5')
},2000)