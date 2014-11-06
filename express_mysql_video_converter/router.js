module.exports = function(app) {    

    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });

    app.post('/post', function (req, res) {
        //res.send('Got a POST request');        
       //var encoderBack = require('./videoencoder')(req.body);
       //console.log('[router]encoderBack='+encoderBack);

    // require('./videoencoder')(req.body, function (result) {          
    //     console.log('[router] videoencoder:'+result);
    // });

        

        // var usesql  = require('./sql');
        // usesql.querydb(null, function(result){
        //     console.log(result);
        // });

     
        //{
        //        "fileurl": "https://googledrive.com/host/0B8p3dPzRohcndXRaNm1OamFXUUE",
        //        "btype": "1080p,720p,360p",
        //        "state":"0"
        //}
        //var post  = req.body ;//{ fileurl: 'url', btype:'1080p,720p',state:'0'};
        require('./queue')(req.body, req.headers.host, function (result) {          
            console.log('[router] queue:'+result);

        });
        // usesql.insertdb(post, function(result){
        //     console.log('[router] post inserted'+post);
        // });


        // mysql.execSql('INSERT INTO videoencoder SET ?', post, function (err, rows) {          
        //     //my_callback();
        //     console.log('[router] post insert');
        // });

        // mysql.execSql('SELECT * FROM videoencoder where state= 0', [], function (err, rows) {        
        //     if (!rows[0]) {
        //         //my_callback("Couldn't find user", null);
        //         return;
        //     }
        //     //my_callback(rows[0]);
        //     for(var key in rows)
        //         console.log('[router] post query - '+rows[key].id+':'+rows[key].btype);//[0]
        // });






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
