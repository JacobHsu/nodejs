var async = require('async');
var moment = require('moment');
var colors = require('colors');

module.exports = function(pollingTimer, module_callback) {

    var queue = require('./queue');

    queue.pop(null, function(result) {

        if (typeof(result) !== "undefined") {

            async.waterfall([
                function(callback) {

                    queue.start(result.id, function(result) {
                        console.log('========== [consumer] queue start ' + result.bgRed);
                        callback(null, result);
                    });

                },
                function(queueStartResult, callback) {

                    var cp = require('child_process');
                    var child = cp.fork('./consumer');

                    console.log(moment().format('hh:mm:ss') + ' PID='.bgBlue + child.pid + '========== [consumer] start '.bgBlue);

                    child.on('message', function(m) {

                        if (typeof(m.taskid) !== "undefined") {
                            queue.finish(m.taskid, function(result) {
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
