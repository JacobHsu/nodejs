var async = require('async');
var moment = require('moment');
var colors = require('colors');
var storage = require('node-persist');

module.exports = function(pollingTimer, module_callback) { 

    var queue = require('./queue');

    queue.pop(null, function(result) {

        storage.initSync();

        //process.stdout.write( ' numForks= '.green+storage.length() );
         
        for (var i=0; i < storage.length(); i++)  {
           process.stdout.write('#'.green + storage.key(i) );
           storage.removeItem( storage.key(i) );
        }


        if (typeof(result) !== "undefined") {
 
            async.waterfall([
                function(callback) {

                    var numForksMax = config.forks.max; //require('os').cpus().length;
                    var numForks = storage.length();
                    
                    if(numForks < numForksMax) 
                       callback(null, numForks);
                    else
                       module_callback('numForks > numForksMax'); 

                },
                function(numForks, callback) {
                  
                    var cp = require('child_process');
                    var child = cp.fork('./consumer');

                    console.log(moment().format('hh:mm:ss') + ' PID='.bgBlue + child.pid + '========== [supervisor] fork start '.green);
                    storage.setItem( child.pid.toString() ,child.pid);
                    process.stdout.write('#'.green + storage.getItem( child.pid.toString() ) );

                    child.on('message', function(m) {

                        if (typeof(m.taskid) !== "undefined") {
                            queue.finish(m.taskid, function(result) {

                                storage.removeItem( child.pid.toString() );
                                console.log( 'numForks= '.green+ storage.length() );
                                callback(null, result.bgRed + ' [consumer] end =========='.bgBlue);

                            });
                        } else {
                            callback(null, m.bgRed + ' [consumer] end =========='.bgBlue);
                        }
                    });

                    var videoReq = {
                        fileurl: result.fileurl,
                        btype: result.btype,
                        recipient: result.recipient,
                        taskid: result.id
                    };

                    child.send(videoReq);
                   

                }
            ], function(err, result) {
                module_callback(result);

            });


           
        } else {
            //module_callback(moment().format('hh:mm:ss')+' [supervisor] pop null =========='.bgGreen);
        }


    });

}
