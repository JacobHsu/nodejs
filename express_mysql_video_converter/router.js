var POLLING_INTERVAL = 5000;

module.exports = function(app) {    
    var pollingTimer;
    app.get('/get', function (req, res){
        res.send('Got a GET request');
        console.log(req.query);
    });
    // var out;    
     //pollingLoop(pollingTimer);
    // var add_var = "Hello";
    // console.log('&&&&&&&&&&&&&&&&&&&=='+ out._idleTimeout );
    // console.log('out=='+out); //out==[object Object]
    // console.log(out); //out=={ _idleTimeout: 3000 }

    //setTimeout(pollingLoop, POLLING_INTERVAL);


    app.post('/post', function (req, res) {

        var queue  = require('./queue');
        queue.push(req.body, req.connection.remoteAddress, req.headers['user-agent'], function(result){
                console.log(result);
        });

        res.send(req.body); 

    });

    pollingLoop();

    app.get('*', notFound);
};

function notFound(req, res)
{
    res.send('404', 'Page Not Found');
}

function pollingLoop(){ 

    require('./consumer')( null, function (result) {          
        console.log('[pollingLoop]'+result);
    });

   //setTimeout(pollingLoop, POLLING_INTERVAL);
}
