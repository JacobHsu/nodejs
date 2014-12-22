global.config  = require('./config')();
global.mysql   = require('./mysql');
var async = require('async');
var moment = require('moment');
var colors = require('colors');
var url = require("url");

module.exports = new mysqldb;
function mysqldb(){   
    mysql.start(config.mysql); 
}

mysqldb.prototype.push = function (postReq, postFrom, postAgent, my_callback){

    var videoHash = url.parse(postReq.fileurl).pathname.split('/').slice(-2).shift(); 

    postReq.hash = videoHash;
    postReq.progress = 'start';
    postReq.from = postFrom;
    postReq.agent = postAgent;
    postReq.enterdate = moment().format('YYYY-MM-DD, hh:mm:ss');
    postReq.log = 'start';

    mysql.execSql('INSERT INTO '+config.dbtable.table+' SET ?', postReq, function (err, rows) {    

        console.log('========== [queue] job insert =========='.yellow);
        if(err){
          console.log(err);
        }else{
          my_callback('========== [router] callback queue: all items have been processed ==========');
        }
    });
} 

mysqldb.prototype.pop = function(qid, my_callback) {

    mysql.execSql('SELECT * FROM '+config.dbtable.table+' where state= 0 limit 1', [], function (err, rows) {        
        if (err) {
            //console.log(err);
            my_callback('queue null');
        }else{
            my_callback(rows[0]);  
        }
        
    });    
}

mysqldb.prototype.start = function(qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET state = 1, log="start" WHERE id=?', [qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid+' start');
    });
}

mysqldb.prototype.finish = function(qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET state = 2 WHERE id=?', [qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid+' finish');
    });
}


mysqldb.prototype.err = function(qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET state = 4 WHERE id=?', [qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid+' error');
    });
}

mysqldb.prototype.updateProgress = function(progress, qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET progress = ? WHERE id=?', [progress,qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid);
    });
}

mysqldb.prototype.updateLog = function(log, qid, my_callback) {

    mysql.execSql('SELECT log FROM '+config.dbtable.table+' WHERE id=?', [qid], function (err, rows) {     

        mysql.execSql('UPDATE '+config.dbtable.table+' SET log = ? WHERE id=?',[ rows[0].log+log ,qid], function (err, rows){
            if(err){
                console.log(err);
            }                            
        });  

        my_callback(null);
    });
}

mysqldb.prototype.queryProgress = function(qid, my_callback) {

    mysql.execSql('SELECT progress FROM ' + config.dbtable.table + ' where hash=? limit 1', [qid], function(err, rows) {

        if (err) {
            console.log(err);
            my_callback('queue null');
        } else {
            my_callback(rows[0]);
        }

    });
}












