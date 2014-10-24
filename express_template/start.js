//var cluster    = require('cluster');
var numCPUs    = require('os').cpus().length;
var server     = require('./server');
var fs         = require('fs');

global.mongodb = require('./mongodb');
global.mysql   = require('./mysql');
global.config  = require('./config')();
/*
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('listening', function(worker, address) {
        console.log('A worker is now connected to ' + address.address + ':' + address.port);
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        //cluster.fork();  //if died create new children
    });
} 
else 
{
    //mysql.start(config.mysql);
    //mongodb.start(config.database);
    server.start(config.server);
}
*/

 server.start(config.server);