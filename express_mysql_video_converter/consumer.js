global.config  = require('./config')();

var async = require('async');
var url = require("url");
var uuid = require('node-uuid');
var fs = require('fs');

var queue  = require('./queue');

process.on('message', function(videoReq) {

    async.waterfall([
        function(callback){ 

            var uuidFileName = uuid.v1();

            if (!fs.existsSync(config.wget.dir)){
                fs.mkdirSync(config.wget.dir);
            }
            
            var path = config.wget.dir +'/'+uuidFileName+'.mp4';
     
            fs.exists(path, function(exists) {
                if (exists) {
                    var newUuidFileName = uuid.v1();
                    path = config.wget.dir +'/'+newUuidFileName+'.mp4';
                }
            });

            var exec = require('child_process').exec,child;
            var wget = config.wget.command + videoReq.fileurl + config.wget.output + path;

            child = exec(wget, function(err, stdout, stderr) {
                if (err){

                    queue.err(videoReq.taskid, function(result){
                        process.send('[videoencoder] '+videoReq.taskid+' wget fail '+err);
                    });
  
                }
                else {
                    console.log('[videoencoder] wget : '+videoReq.fileurl);
                    callback(null, uuidFileName); 
                }
            });

        },
        function(uuidFileName, callback){ 
            
            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input+uuidFileName+'.mp4'; 
            var outputVideoName = config.ffmpeg.output+uuidFileName;
            var outputVideo,outputVideoArray=[];

            var input_args = ['-i',inputVideo,'-pass','1','-vcodec',config.ffmpeg.vcodec,'-b:v',config.ffmpeg.inputBitrate,'-bt',config.ffmpeg.tolerance,'-threads','0','-qmin','10','-qmax','31','-g','30']; 

            var args = input_args;
            var size = videoReq.btype.split(',');
            if('' != size) {
                for(var n in size){
                    if(size[n]==="1080p"){
                        outputVideo = outputVideoName+'-1080p.mp4';
                        output_args = ['-s','1920x1080','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    }
                    else if(size[n]==="720p"){
                        outputVideo = outputVideoName+'-720p.mp4';
                        output_args = ['-s','1280x720','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    }
                    else if(size[n]==="480p"){
                        outputVideo = outputVideoName+'-480p.mp4';
                        output_args = ['-s','854x480','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo];
                        args = args.concat(output_args); 
                        outputVideoArray.push(outputVideo);
                    }
                    else if(size[n]==="360p"){
                        outputVideo = outputVideoName+'-360p.mp4';
                        output_args = ['-s','640x360','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    }
                }
                
            }
       

            var str = args.toString()
            var commandstr = str.replace(/,/g, " ");
            //console.log('ffmpeg command:'+commandstr);
            console.log('[videoencoder] ffmpeg : ');

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date()
 
            ffmpeg.stdout.on('data',function(data){
                console.log('stdout:', data);
            });

            var duration = 0, time = 0, progress = 0;

            ffmpeg.stderr.on('data',function(data){
               // console.log('stderr:', data.toString());
               
                var content = data.toString();
                var totalTime = (content) ? content.match(/Duration: (.*?), start:/) : [];

                if(totalTime)
                    console.log('[videoencoder] '+ totalTime);
       
                if( totalTime ){
                    var rawDuration = totalTime[1];
                    var arHMS = rawDuration.split(":").reverse();
                    duration = parseFloat(arHMS[0]);
                    if (arHMS[1]) duration += parseInt(arHMS[1]) * 60;
                    if (arHMS[2]) duration += parseInt(arHMS[2]) * 60 * 60;

                }
       
                var getTime = content.match(/time=(.*?) bitrate/g);
                


                if( getTime ){
                    var rawTime = getTime[0].replace('time=','').replace(' bitrate','');

                    arHMS = rawTime.split(":").reverse();
                    time = parseFloat(arHMS[0]);
                    if (arHMS[1]) time += parseInt(arHMS[1]) * 60;
                    if (arHMS[2]) time += parseInt(arHMS[2]) * 60 * 60;

                    progress = Math.round((time/duration) * 100);
                    process.stdout.write( parseInt(duration - time)+"\#"+progress+"% ");
                    
                    queue.updateProgress(progress, videoReq.taskid, function(result){
                        //console.log(result);
                    });
                    
                }

                queue.updateLog(data.toString(), videoReq.taskid, function(result){
                    //console.log(result);
                });
 
                //fs.appendFileSync(__dirname+config.ffmpeg.logfile, data.toString() );

            });
            ffmpeg.on('exit', function (code) {
                //fs.appendFileSync(__dirname+config.ffmpeg.logfile, '~~~~~~~~~~~~~~~~~~~~~~~');
                console.log('exit:'+code+' (0:Success 1:Fail) ');
                
                if(code==0){
                    console.log('convert time:', ((new Date() - start) / 1000), 's');
                    console.log('[videoencoder] ffmpeg : '+outputVideoArray.length+' videos');
                }
                else
                    console.log('[videoencoder] ffmpeg : FAIL!!!');
     
                callback(null, outputVideoArray);
            });
            
        },
        function(outputVideoArray,callback){
            
            async.map(outputVideoArray, mp4boxExeMap, function (err, result) {
                if(!err) {

                    var fileName = url.parse(videoReq.fileurl).pathname.split('/').pop().split('.').shift();
                    var videoHash = url.parse(videoReq.fileurl).pathname.split('/').slice(-2).shift(); 

                    var jsonObj = new Object();
                    jsonObj.files = result;
                    jsonObj.filename = fileName;
                    jsonObj.videoHash = videoHash;

                    require('./request')(jsonObj, videoReq.recipient ,function (result) {          
                        console.log('[videoencoder] callback request:'+result);
                        callback(null, { taskid:videoReq.taskid, state:'Finished' });  
                    });

                     
                } else {
                    console.log('Error: ' + err);
                }
            });
        }
    ], function (err, result) {   
          process.send(result);
    });


}); 

function mp4boxExeMap(outputVideo, callback) {

    var exec = require('child_process').exec,child;
    var mp4box = config.mp4box.command  + outputVideo;

    child = exec(mp4box, function(err, stdout, stderr) {
        if (err) throw err;
    });  
    child.on('exit', function (code) {
        console.log('[videoencoder] mp4box : '+mp4box.slice(-25)+' exit:'+code+' (0:Success 1:Fail) ');
        var fileurl =  config.files.url + mp4box.split('/').pop();
        callback(null, fileurl );  
    });
}

