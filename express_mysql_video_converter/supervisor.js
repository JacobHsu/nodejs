var moment = require('moment');
var colors = require('colors');

process.on('message', function(m) {

    var queue  = require('./queue');

    queue.pop(null, function(result){

        if (typeof(result) !== "undefined") {

            var cp = require('child_process');
            var child = cp.fork('./consumer'); 

            child.on('message', function(m) {
   
                if (typeof(m.taskid) !== "undefined"){
                    queue.finish(m.taskid, function(result){
                        process.send( result.bgRed+' [consumer] end =========='.bgBlue);
                    });
                }else{
                    process.send( m.bgRed+' [consumer] end =========='.bgBlue);
                }


            });

    		var videoReq = { 
    			fileurl: result.fileurl, 
    			btype: result.btype,
    			recipient: result.recipient,
    			taskid:result.id
    		};

            queue.start(result.id, function(result){
                //console.log('Child process started: %d', child.pid);
                console.log(moment().format('hh:mm:ss')+' PID='.bgBlue+child.pid+'========== [consumer] start '.bgBlue+result.bgRed);
            });
    		
    		child.send(videoReq);

         }else{
            //process.send(moment().format('hh:mm:ss')+' [supervisor] pop null =========='.bgGreen);
         }


    });

});

