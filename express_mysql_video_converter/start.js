var server     = require('./server');
global.config  = require('./config')();
server.start(config.server);



