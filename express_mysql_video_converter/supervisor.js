global.config  = require('./config')();
var async = require('async');
var moment = require('moment');
var colors = require('colors');

var queue = require('./queue');
var jobs = require('./jobs');

var forkQueueArr=[];
var count=0;

process.on('message', function(m) {

    
    queue.pop(null, function(result) {

        if (typeof(result) !== "undefined") {

            var videoReq = {
                fileurl: result.fileurl,
                btype: result.btype,
                recipient: result.recipient,
                taskid: result.id
            };

            var cp = require('child_process');
            var child = cp.fork('./consumer');

            if (forkQueueArr.length < config.forks.max) {
                console.log(moment().format('hh:mm:ss') + ' PID='.bgBlue + child.pid + '========== [supervisor] fork start '.green);
                
                console.log('---push---');
                forkQueueArr.push(child.pid);
                console.log(forkQueueArr);
                console.log('---------');

                child.send(videoReq);
            } else {
                console.log('numForks > numForksMax'.red);
                process.send(count++)
            }

            child.on('message', function(m) {

                console.log('---shift---');
                forkQueueArr.shift();
                console.log(forkQueueArr);
                console.log('---------');

                if (typeof(m.taskid) !== "undefined") {
                    jobs.finish(m.taskid, function(result) {

                        console.log(m.taskid + ' [consumer] end =========='.bgBlue);

                    });
                } else {
                    console.log(m.taskid + ' received fail !!');
                }


            });


        } else {
            process.send(m.forkId)
        }


    });


});



