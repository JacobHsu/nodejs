module.exports = function(app) {    

    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });

    app.post('/post', function (req, res) {
        //res.send('Got a POST request');        
     
        //res.headers req.body
        res.send(req.headers.host); 

    });

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
