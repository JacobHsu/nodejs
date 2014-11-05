global.mysql   = require('./mysql');
var async = require('async');
module.exports = function (postReq, my_callback){

	mysql.start(config.mysql);

    async.waterfall([

        function(callback){
            // do some stuff ...
            mysql.execSql('INSERT INTO videoencoder SET ?', postReq, function (err, rows) {    
                //my_callback();
                console.log('[router] post insert');
                callback(null, 'insert');
            });
             //console.log('[router] post insert');
        },
        function(insertResult, callback){
            // do some more stuff ...
            mysql.execSql('SELECT * FROM videoencoder where state= 0 limit 1', [], function (err, rows) {        
            if (!rows[0]) {
                return;
            }

            for(var key in rows)
 
                callback(null, rows[key].id, rows[key].fileurl, rows[key].btype);
            });
        },
        function(queryID, queryFileurl, queryBtype, callback){
            // do some more stuff ...
            console.log('[router] videoReq - '+queryID+':'+queryFileurl+queryBtype);//[0]

              var videoReq = { 
                fileurl: queryFileurl, 
                btype: queryBtype
              };

            require('./videoencoder')(videoReq, function (result) {          
                console.log('[router] videoencoder:'+result);
                callback(null, queryID);
            });

            
        },
        function(queryID, callback){

            mysql.execSql('DELETE FROM videoencoder WHERE id = ?', queryID, function (err, rows){        

                if(err){
                    console.log(err);
                }

                console.log('[router] DELETE '+queryID);  
                callback(null, 'done');
            });
        }
    ],
    // optional callback
    function(err, results){
        // results is now equal to ['one', 'two']
        console.log('[router] job end :'+results);
    });

} 