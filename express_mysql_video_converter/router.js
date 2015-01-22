var queue = require('./queue');
var jobs = require('./jobs');

module.exports = function(app) {

    app.post('/video', video);
    app.post('/progress', progress);

    var cp = require('child_process');
    var child = cp.fork('./supervisor');

    child.send({});

    app.get('*', notFound);
};


function video(req, res) {

    queue.push(req, function(result) {
        res.json(result);
    });

};

function progress(req, res) {

    jobs.queryProgress(req.body.videoid, function(result) {
        res.json(result);
    });

};

function notFound(req, res) {
    res.send('404', 'Page Not Found');
}



