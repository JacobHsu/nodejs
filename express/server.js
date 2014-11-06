var express = require('express');
var bodyParser = require('body-parser');

exports.start = function (config) {
    var app = express();

    app.use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    });
    
    app.use(bodyParser.json({ type: 'application/json' })); 
    app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', extended:false}));

    app.use(express.static( __dirname + '/public'));    
    
    var env = process.env.NODE_ENV || 'development';
    
    if ('development' == env) {       
    }
    else {       
    }

    require('./router')(app);

    var server = app.listen(config.port, function() {
        console.log('[server] Listening on port %d', server.address().port);
    });
}
