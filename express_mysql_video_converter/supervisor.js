global.config  = require('./config')();
var async = require('async');
var moment = require('moment');
var colors = require('colors');

var queue = require('./queue');
var jobs = require('./jobs');

var POLLING_INTERVAL = 5000;

var forkQueueArr=[];


process.on('message', loop);

function loop() {

    queue.pop(null, function(result) {

        if (typeof(result) !== "undefined") {

            if (forkQueueArr.length < config.forks.max) {

                var cp = require('child_process');
                var child = cp.fork('./consumer');

                console.log(moment().format('hh:mm:ss') + ' PID='.bgBlue + child.pid + '========== [supervisor] fork start '.green);
                
                console.log('---push---');
                forkQueueArr.push(child.pid);
                console.log(forkQueueArr);
                console.log('---------');

                var videoReq = {
                    fileurl: result.fileurl,
                    btype: result.btype,
                    recipient: result.recipient,
                    taskid: result.id,
                    forkpid: child.pid
                };
                child.send(videoReq);

                child.on('message', function(m) {
                    console.log(m);
                    console.log('---splice---');
                    var index = forkQueueArr.indexOf(m.forkpid);
                    if (index >= 0) {
                        forkQueueArr.splice( index, 1 );
                    }
                    console.log(forkQueueArr);
                    console.log('---------');

                    if (typeof(m.taskid) !== "undefined") {
                        jobs.updateState(2, m.taskid, function(result) {
                            console.log(m.taskid + ' [consumer] end =========='.bgBlue);
                        });
                    } else {
                        console.log(m.forkpid + ' [supervisor] received fail !!');
                    }

                });

            } else {
                console.log('numForks > numForksMax'.red);
            }

        } 

        setTimeout(loop, POLLING_INTERVAL);
    });

    
}