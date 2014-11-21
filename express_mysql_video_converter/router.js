module.exports = function(app) {    

    app.get('/get', function (req, res){        
        res.send('Got a GET request');       
        console.log(req.query);
    });
   
    app.post('/post', function (req, res) {

        require('./queue')(req.body, req.connection.remoteAddress, req.headers['user-agent'], function (result) {          
            console.log(result);
        });

        res.send(req.body); 

    });

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}
