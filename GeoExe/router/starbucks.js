//스타벅스 정보를 저장, 조회를 위한 라우팅 함수 정의

//0.스타벅스 정보를 저장하기 위한 라우팅 함수
var add = function(req,res){

    console.log('add 함수 호출됨')

    var name = req.body.name
    var addr = req.body.addr
    var tel = req.body.tel
    var longitude = req.body.longitude
    var latitude = req.body.latitude

    var database = req.app.get('database')

    if(database){
        
        addStarbucks(database,name,addr,tel,longitude,latitude,function(err,result){

            if(err){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 추가중 에러 발생</h2>')
                res.end()

                return
            }

            if(result){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 추가 성공</h2>')
                res.end()
            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 추가 실패</h2>')
                res.end()
            }
        })

    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, " +
			"height=device-height, initial-scale=1'>");
        res.write('<h2>데이타베이스 연결 실패</h2>')
        res.end()
    }
}

//1. 스타벅스 정보를 조회하기 위한 라우팅 함수
var list = function(req,res){
    
    console.log('list 호출됨')

    var database = req.app.get('database')

    if(database){
        
        database.StarModel.findAll(function(err,result){

            if(err){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 중 에러 발생</h2>')
                res.end()

                return
            }

            if(result){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 리스트</h2>')
                res.write('<div><ul>')

                for(var i=0;i<result.length;i++){

                    var name = result[i].name
                    var addr = result[i].addr
                    var tel = result[i].tel
                    var longitude = result[i].geometry.coordinates[0]
                    var latitude = result[i].geometry.coordinates[1]

                    res.write('<li>#' + (i+1) + ' : ' + 
                            name + ', ' + addr + ', ' + tel + ', ' +
                            longitude + ', ' + latitude + '</li>')


                }

                res.write('</ul></div>')
                res.end()
            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 실패</h2>')
                res.end()
            }


        })
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, " +
			"height=device-height, initial-scale=1'>");
        res.write('<h2>데이타베이스 연결 실패</h2>')
        res.end()
        }
}

//2. 가장 가까운 스타벅스 정보를 조회하기 위한 라우팅 함수
var findNear = function(req,res){

    console.log('findNear 호출됨')

    var maxDistance = 150   //10:100m, 100:1km
    
    var longitude = req.body.longitude
    var latitude = req.body.latitude

    var database = req.app.get('database')

    if(database){
        
        database.StarModel.findNear(longitude,latitude,maxDistance,function(err,result){

            if(err){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 검색 중 에러 발생</h2>')
                res.end()

                return
            }

            if(result){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>가장 가까운 스타벅스 리스트</h2>')

                res.write('<div><ul>')

                for(var i=0;i<result.length;i++){

                    var name = result[i].name
                    var addr = result[i].addr
                    var tel = result[i].tel
                    var longitude = result[i].geometry.coordinates[0]
                    var latitude = result[i].geometry.coordinates[1]

                    res.write('<li>#' + (i+1) + ' : ' + 
                            name + ', ' + addr + ', ' + tel + ', ' +
                            longitude + ', ' + latitude + '</li>')


                }

                res.write('</ul></div>')


                res.end()
            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 실패</h2>')
                res.end()
            }
        })

    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, " +
			"height=device-height, initial-scale=1'>");
        res.write('<h2>데이타베이스 연결 실패</h2>')
        res.end()
    }
}

//3. 범위 안의 스타벅스 정보를 조회하기 위한 라우팅 함수
var findWithin = function(req,res){

    console.log('findWithin 호출됨')

    var topleft_longitude = req.body.topleft_longitude
    var topleft_latitude = req.body.topleft_latitude

    var bottomright_longitude = req.body.bottomright_longitude
    var bottomright_latitude = req.body.bottomright_latitude

    var database = req.app.get('database')

    if(database){

        database.StarModel.findWithin(topleft_longitude,topleft_latitude,
            bottomright_longitude,bottomright_latitude,function(err,result){

                if(err){

                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>스타벅스 검색 중 에러 발생</h2>')
                    res.end()
    
                    return
                }
    
                if(result){
    
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>범위 내의 스타벅스 리스트</h2>')
    
                    res.write('<div><ul>')
    
                    for(var i=0;i<result.length;i++){
    
                        var name = result[i].name
                        var addr = result[i].addr
                        var tel = result[i].tel
                        var longitude = result[i].geometry.coordinates[0]
                        var latitude = result[i].geometry.coordinates[1]
    
                        res.write('<li>#' + (i+1) + ' : ' + 
                                name + ', ' + addr + ', ' + tel + ', ' +
                                longitude + ', ' + latitude + '</li>')
    
    
                    }
    
                    res.write('</ul></div>')
    
    
                    res.end()
                }else{
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>스타벅스 조회 실패</h2>')
                    res.end()
                }
            }
        )
    
    }else{
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            res.write("<meta name='viewport' content='width=device-width, " +
                "height=device-height, initial-scale=1'>");
            res.write('<h2>데이타베이스 연결 실패</h2>')
            res.end()
    }

}

//4. 반경의 스타벅스 정보를 조회하기 위한 라우팅 함수
var findCircle = function(req,res){

    console.log('findCircle 호출됨')

    var center_longitude = req.body.center_longitude
    var center_latitude = req.body.center_latitude
    var radius = req.body.radius

    var database = req.app.get('database')

    if(database){

        database.StarModel.findCircle(center_longitude,center_latitude,radius,
            function(err,result){

                if(err){

                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>스타벅스 검색 중 에러 발생</h2>')
                    res.end()
    
                    return
                }
    
                if(result){
    
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>반경 내의 스타벅스 리스트</h2>')
    
                    res.write('<div><ul>')
    
                    for(var i=0;i<result.length;i++){
    
                        var name = result[i].name
                        var addr = result[i].addr
                        var tel = result[i].tel
                        var longitude = result[i].geometry.coordinates[0]
                        var latitude = result[i].geometry.coordinates[1]
    
                        res.write('<li>#' + (i+1) + ' : ' + 
                                name + ', ' + addr + ', ' + tel + ', ' +
                                longitude + ', ' + latitude + '</li>')
    
    
                    }
    
                    res.write('</ul></div>')
    
    
                    res.end()
                }else{
                    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    res.write("<meta name='viewport' content='width=device-width, " +
                        "height=device-height, initial-scale=1'>");
                    res.write('<h2>스타벅스 조회 실패</h2>')
                    res.end()
                }
            }
        )
    
    }else{
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            res.write("<meta name='viewport' content='width=device-width, " +
                "height=device-height, initial-scale=1'>");
            res.write('<h2>데이타베이스 연결 실패</h2>')
            res.end()
    }

}

//5. 가장 가까운 스타벅스 정보를 지도에 표시하기 위한 라우팅 함수
var findNear2 = function(req,res){

    console.log('findNear2 호출됨')

    var maxDistance = 150   //10:100m, 100:1km
    
    var longitude = req.body.longitude
    var latitude = req.body.latitude

    var database = req.app.get('database')

    if(database){
        
        database.StarModel.findNear(longitude,latitude,maxDistance,function(err,result){

            if(err){

                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 검색 중 에러 발생</h2>')
                res.end()

                return
            }

            if(result){

                res.render('findNear.ejs',{result:result[0]._doc,
                    longitude:longitude,latitude:latitude})

                
            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write("<meta name='viewport' content='width=device-width, " +
					"height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 실패</h2>')
                res.end()
            }
        })

    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<meta name='viewport' content='width=device-width, " +
			"height=device-height, initial-scale=1'>");
        res.write('<h2>데이타베이스 연결 실패</h2>')
        res.end()
    }
}

//스타벅스를 추가하는 함수
var addStarbucks = function(database,name,addr,tel,longitude,latitude,callback){

    console.log('addStarbucks 호출됨')

    //StarModel 인스턴스 생성
    var starbucks = new database.StarModel(
        {name:name,addr:addr,tel:tel,
            geometry:{
                type:'Point',
                coordinates:[longitude,latitude]
            }
        }
    )

    starbucks.save(function(err){
        
        if(err) throw error

        console.log('스타벅스 데이터 추가함')

        callback(null,starbucks)

    })

}

module.exports.add = add
module.exports.list = list
module.exports.findNear = findNear
module.exports.findWithin = findWithin
module.exports.findCircle = findCircle
module.exports.findNear2 = findNear2