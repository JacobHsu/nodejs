var POLLING_INTERVAL = 5000;

module.exports = function(app) {    

    app.get('/get', function (req, res){
        res.send('Got a GET request');
        console.log(req.query);
    });

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

    var cp = require('child_process');
    var child = cp.fork('./supervisor');

    child.on('message', function(m) {
        console.log('supervisor.pid='+child.pid+' '+m);
        child.kill();

    });
    child.send(null);
    
    setTimeout(pollingLoop, POLLING_INTERVAL);
}
