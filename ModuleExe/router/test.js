var testJade = function(req,res){

    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    var context = {}
    req.app.render('jadeTest',context,function(err,html){

        if(err) throw err
        console.log('rendered : ' + html)

        res.end(html)
    })
}

module.exports.testJade = testJade