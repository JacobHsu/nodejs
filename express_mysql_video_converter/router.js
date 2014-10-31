global.mysql   = require('./mysql');

module.exports = function(app) {    

    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });

    app.post('/post', function (req, res) {
        //res.send('Got a POST request');        
       //require('./videoencoder')(req.body);

        mysql.start(config.mysql);

        var usesql  = require('./sql');
        usesql.querydb(null, function(result){
            console.log(result);
        });

     
        //{
        //        "fileurl": "https://googledrive.com/host/0B8p3dPzRohcndXRaNm1OamFXUUE",
        //        "btype": "1080p,720p,360p",
        //        "state":"0"
        //}
        var post  = req.body ;//{ fileurl: 'url', btype:'1080p,720p',state:'0'};
        usesql.insertdb(post, function(result){
            console.log('[router] post inserted'+post);
        });

        // res.json({
        //     fileurl: req.body.fileurl, 
        //     btype: req.body.btype
        // })

        res.send(req.body); //req.body.fileurl

    });

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
