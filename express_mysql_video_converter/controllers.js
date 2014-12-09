var queue = require('./queue');

exports.video = function(req, res) {

    queue.push(req.body, req.connection.remoteAddress, req.headers['user-agent'], function(result) {
        res.json(result);
    });

};

exports.progress = function(req, res) {

    queue.queryProgress(req.body.hash, function(result) {
        res.json(result);
    });

};


