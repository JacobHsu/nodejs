module.exports = function(app) {    

    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });

    app.post('/post', function (req, res) {
        //res.send('Got a POST request');        
        require('./videoencoder')(req.body);

        res.json({
            fileurl: req.body.fileurl, 
            btype: req.body.btype
        })

        //res.send(req.body.fileurl);

    });

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
