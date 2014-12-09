var POLLING_INTERVAL = 5000;

module.exports = function(app) {

    var videoecndoer = require('./controllers');
    app.post('/video', videoecndoer.video);
    app.post('/progress', videoecndoer.progress);

    pollingLoop();

};

function notFound(req, res) {
    res.send('404', 'Page Not Found');
}

function pollingLoop() {

    require('./supervisor')(null, function(result) {
        console.log('[pollingLoop]' + result)
    });

    setTimeout(pollingLoop, POLLING_INTERVAL);
}
