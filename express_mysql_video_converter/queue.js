global.mysql   = require('./mysql');
var async = require('async');
var moment = require('moment');
var colors = require('colors');

module.exports = new mysqldb;
function mysqldb(){   
    mysql.start(config.mysql); 
}

mysqldb.prototype.push = function (postReq, postFrom, postAgent, my_callback){
    
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

    mysql.execSql('SELECT * FROM '+config.dbtable.table+' where state= 0 ', [], function (err, rows) {        
        if (err) {
            //console.log(err);
            my_callback('queue null');
        }else{
            my_callback(rows[0]);  
        }
        
    });    
}

mysqldb.prototype.finish = function(qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET state = 1 WHERE id=?', [qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid+' finish');
    });
}


mysqldb.prototype.updateProgress = function(progress, qid, my_callback) {

    mysql.execSql('UPDATE '+config.dbtable.table+' SET progress = ? WHERE id=?', [progress,qid], function (err, rows) {        
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(null);
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











