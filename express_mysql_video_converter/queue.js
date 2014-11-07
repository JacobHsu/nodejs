global.mysql   = require('./mysql');
var async = require('async');

module.exports = function (postReq, postFrom, module_callback){
    
    postReq.progress = 'start';
    postReq.from = postFrom;


	mysql.start(config.mysql);

    async.waterfall([

        function(callback){

            mysql.execSql('INSERT INTO '+config.dbtable.table+' SET ?', postReq, function (err, rows) {    

                console.log('========== [queue] job start ==========');
                if(err){
                  console.log(err);
                }else{
                  callback(null, 'insert');
                }
            });
  
        },
        function(insertResult, callback){

            mysql.execSql('SELECT * FROM '+config.dbtable.table+' where state= 0 ', [], function (err, rows) {        
                if (!rows[0]) {
                    return;
                }
               
                console.log(rows);

                var q = async.queue(function (task, callback) {

                    console.log('========== [queue] task '+ task.id +' ==========');

                    var videoReq = { 
                        fileurl: task.fileurl, 
                        btype: task.btype,
                        recipient: task.recipient
                    };
                    
                    require('./videoencoder')(videoReq, function (result) {          
                        console.log('[queue] videoencoder: task '+ task.id + ' '+result + ' UPDATE state=1');
      
                        mysql.execSql('UPDATE '+config.dbtable.table+' SET state = 1 , progress = ? WHERE id=?',['done',task.id], function (err, rows){
                            if(err){
                                console.log(err);
                            }                            
                        });

                        callback();
                    });
                    
                }, 1);


                q.push(rows, function (err) {
                    console.log('[queue] finished processing');

                });
                q.drain = function() {
                    module_callback('========== [router] callback queue: all items have been processed ==========');
                }

             });
        }
    ],
    function(err, results){
        console.log('[queue] job end :'+results);
       
    });

} 





