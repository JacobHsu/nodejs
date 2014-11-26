var moment = require('moment');
var colors = require('colors');
module.exports = function (pollingTimer, module_callback){

	var cp = require('child_process');
    var child = cp.fork('./videoencoder'); // var child = cp.fork('./worker');

    var queue  = require('./queue');
    
    console.log('Child process started: %d', child.pid);

    child.on('message', function(m) {

        queue.finish(m.taskid, function(result){
        	module_callback(' callback consumer: '+result+' =========='.bgBlue);
	    });

    });
   
    queue.pop(null, function(result){

        if (typeof(result) !== "undefined") {
			var videoReq = { 
				fileurl: result.fileurl, 
				btype: result.btype,
				recipient: result.recipient,
				taskid:result.id
			};
			console.log(moment().format('hh:mm:ss')+'========== [consumer] pop '.bgBlue);
			child.send(videoReq);
         }else{
         	console.log(moment().format('hh:mm:ss')+'========== [consumer] pop null   =========='.bgGreen);
         }


    });

     
}
