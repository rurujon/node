var oracledb = require('oracledb')
var dbConfig = require('./dbConfig')

oracledb.autoCommit=true

oracledb.getConnection({
    user:dbConfig.user,
    password:dbConfig.password,
    connectString:dbConfig.connectString
    },
    function(err,conn){
        if(err){
            console.log(err.message)
            return
        }

        console.log('Oracle DB연결 성공!')

        var sql

        //create table
        /*
        sql='create table gogak(id varchar2(10),password varchar2(10),'
        sql+='name varchar2(10), age number)'

        conn.execute(sql)

        console.log('테이블 생성 완료')
        */

        //insert
         /*
        sql = 'insert into gogak values (:id,:pwd,:name,:age)';

        //binds = [['suzi','a123','배수지',29]]

       
        binds = [
            ['inna','a123','유인나',33],
            ['insun','a123','정인선',35],
            ['yeji','a123','서예지',29]
        ]
       

        //오토커밋을 하지 않았다면
        //var result = conn.executeMany(sql,binds,{autoCommit:true},function(){})

        var result = conn.executeMany(sql,binds,function(){
            console.log('입력 완료!')
        })

        */

        //update
        /*
        sql = 'update gogak set password=:pw,name=:name,age=:age where id=:id'

        conn.executeMany(sql,[['777','박신혜',30,'suzi']])
        
        console.log('수정완료!')
        */

        //delete
        /*
        sql = 'delete from gogak where id=:id'

        conn.execute(sql,['suzi'])

        console.log('삭제 완료!')
        */

        //select
        sql = 'select id,password,name,age from gogak'

        conn.execute(sql,[],function(err,result){

            if(err){
                console.error(err,message)
                return
            }

            console.log(result.metaData)
            console.log(result.rows)

            dbClose(conn)
        })


    }
)

function dbClose(conn){
    conn.release(function(err){
        if(err) throw err
    })
}