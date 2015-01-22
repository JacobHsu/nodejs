global.config  = require('./config')();
global.mysql   = require('./mysql');
var async = require('async');
var moment = require('moment');
var url = require("url");

module.exports = new mysqldb;
function mysqldb() {
    mysql.start(config.mysql);
}

mysqldb.prototype.push = function(req, my_callback) {

    var queuePushReq= req.body;

    queuePushReq.progress = '0';
    queuePushReq.from = req.connection.remoteAddress;
    queuePushReq.agent = req.headers['user-agent'];
    queuePushReq.enterdate = moment().format('YYYY-MM-DD, hh:mm:ss');
    queuePushReq.log = 'start';

    mysql.execSql('INSERT INTO ' + config.dbtable.table + ' SET ?', queuePushReq, function(err, rows) {

        if (err) {
            my_callback('push err');
        } else {
            var pushResult = {};
            pushResult.status = 'ok';
            pushResult.id = rows.insertId;
            my_callback(pushResult);
        }
    });
}


mysqldb.prototype.pop = function(qid, my_callback) {

    mysql.execSql('SELECT * FROM ' + config.dbtable.table + ' where state= 0 ORDER BY id limit 1', [], function(err, rows) {
        if (err) {
            my_callback('queue null');
        } else {
            my_callback(rows[0]);
        }
    });
}
















