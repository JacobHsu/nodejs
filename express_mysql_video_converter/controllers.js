var queue = require('./queue');
var jobs = require('./jobs');

exports.video = function(req, res) {

    queue.push(req.body, req.connection.remoteAddress, req.headers['user-agent'], function(result) {
        res.json(result);
    });

};

exports.progress = function(req, res) {

    jobs.queryProgress(req.body.videoid, function(result) {
        res.json(result);
    });

};



