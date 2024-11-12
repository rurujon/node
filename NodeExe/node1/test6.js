//callback 함수
//함수를 파라미터로 전달하는 경우(비동기 방식)
//callback 함수는 사용자 정의다

function add(a,b,callback){

    var result = a+b;

    callback(result)

    var history = function(){
        return a + '+' + b + '=' + result
    }

    return history

}

var history = add(10,20,function(result){
    console.log(result)
})

console.log(history())