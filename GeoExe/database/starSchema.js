var Schema = {}

Schema.createSchema = function(mongoose){

    var StarSchema = mongoose.Schema({
        name:{type:String, index:'hashed'},
        addr:{type:String},
        tel:{type:String},
        geometry:{
            type:{type:String,'default':'Point'},
            coordinates:[{type:'Number'}]
        },
        created:{type:Date,'default':Date.now}
    })

    //공간 인덱싱 적용
    StarSchema.index({geometry:'2dsphere'})

    //스키마 메소드 추가
    //1. 모든 스타벅스 조회
    StarSchema.static('findAll',function(callback){
        return this.find({},callback)
    })

    //2.가장 가까운 스타벅스 조회
    StarSchema.static('findNear', function(longitude,latitude,maxDistance,callback){
        this.find().where('geometry')
            .near({center:{type:'Point',
                coordinates:[parseFloat(longitude),parseFloat(latitude)]},
                maxDistance:maxDistance}).limit(1).exec(callback)
    })

    //3. 범위 안의 스타벅스 조회
    StarSchema.static('findWithin',function(topleft_longitude,topleft_latitude,
        bottomright_longitude,bottomright_latitude,callback){
            this.find().where('geometry')
                .within({box:[[parseFloat(topleft_longitude),parseFloat(topleft_latitude)],
                [parseFloat(bottomright_longitude),parseFloat(bottomright_latitude)]]}).exec(callback)
        }
    )

    //4. 반경 안의 스타벅스 조회
    StarSchema.static('findCircle',function(center_longitude,center_latitude,radius,callback){

        //radius : 1/6371 ->1km
        this.find().where('geometry')
            .within({center:[parseFloat(center_longitude),parseFloat(center_latitude)],
                radius:parseFloat(radius/6371000),
                unique:true, spherical:true}).exec(callback)
    })

    console.log('StarSchema 정의함')

    return StarSchema

}

module.exports = Schema



/*
* 위치기반 서비스 서버 만들기(LBS : Location Based Service)

특정 위치의 정보를 제공하고 조회하는 방법을 데이터베이스에서 
대부분 제공. 몽고디비도 기능을 제공

1. 스타벅스의 위치정보 확인(이름,전화번호,위치 경도)
2. 스타벅스의 위치정보 저장
3. 스타벅스를 위치로 조회

* 위치정보는 사람의 이름과 같은 문자열을 저장하는 것과 다르게 
  경도와 위도를 사용
* 위치정보를 저장하거나 조회할때는 공간 인덱싱(Spatial Indexing)이란 방법으로
  경도와 위도의 좌표를 인덱스로 만들어 조회속도를 높임
* 몽고디비에서는 GeoSpatial Indexing 이라 함

* 조회방법
	1. 사용자 위치에서 가장 가까운 스타벅스(near)
	2. 사용자가 보고있는 지도 범위 안의 스타벅스(within)
	3. 사용자가 있는 곳에서 일정 반경 안에 있는 스타벅스(circle)

* 위치 데이터 종류
	1. Point : 현재위치나 스타벅스의 위치같은 특정한 지점
	2. LineString : 도로와 같이 이어진 위치
	3. Polygon : 청담동, 역삼동 같은 지역

*/

/*
GeoSpatial Schema Definition
 
Geometry
	'type': {type: String, enum: ["Point", "MultiPoint", "LineString",
	"MultiLineString", "Polygon", "MultiPolygon"] },
	coordinates: []
  
Point
	'type': {type: String, 'default': "Point"},
	coordinates: [{type: "Number"}]
  
MultiPoint
	'type': {type: String, default: "MultiPoint"},
	coordinates: [{type: "Array"}]
  
MultiLineString
	'type': {type: String, default: "MultiLineString"},
	coordinates: [{type: "Array"}]
 
Polygon
	'type': {type: String, default: "Polygon"},
	coordinates: [{type: "Array"}]
 
MultiPolygon
	'type': {type: String, default: "MultiPolygon"},
	coordinates: [{type: "Array"}]
  
GeometryCollection
	'type': {type: String, default: "GeometryCollection"},
	geometries: [Geometry]
  
Feature
	id: {type: "String"},
	'type': {type: String, default: "Feature"},
	geometry: Geometry,
	properties: {type: "Object"}
  
FeatureCollection
	'type': {type: String, default: "FeatureCollection"},
	features: [Feature]
 
*/

