var POLLING_INTERVAL = 5000;
var cp = require('child_process');
var child = cp.fork('./supervisor');


module.exports = function(app) {

    var videoecndoer = require('./controllers');
    app.post('/video', videoecndoer.video);
    app.post('/progress', videoecndoer.progress);


    child.on('message', function(m) {
        //console.log('Child process started: %d', child.pid);
        //console.log('received: ' + m);
    });

    pollingLoop();


};

function notFound(req, res) {
    res.send('404', 'Page Not Found');
}


function pollingLoop() {

    child.send({
        forkId: child.pid
    });

    setTimeout(pollingLoop, POLLING_INTERVAL);
}
