global.config  = require('./config')();
global.mysql   = require('./mysql');
var async = require('async');
var moment = require('moment');
var url = require("url");

module.exports = new mysqldb;
function mysqldb() {
    mysql.start(config.mysql);
}

mysqldb.prototype.push = function(postReq, postFrom, postAgent, my_callback) {

    postReq.videoid = url.parse(postReq.recipient).pathname.split('/').pop();
    postReq.progress = '0';
    postReq.from = postFrom;
    postReq.agent = postAgent;
    postReq.enterdate = moment().format('YYYY-MM-DD, hh:mm:ss');
    postReq.log = 'start';

    mysql.execSql('INSERT INTO ' + config.dbtable.table + ' SET ?', postReq, function(err, rows) {

        if (err) {
            console.log(err);
        } else {
            my_callback('========== [router] callback queue: all items have been processed ==========');
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
















