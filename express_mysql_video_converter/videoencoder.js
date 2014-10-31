global.config  = require('./config')();
var async = require('async');
var url = require("url");
var uuid = require('node-uuid');
var fs = require('fs');

module.exports = function (postReq){

    async.waterfall([
        function(callback){

            callback(null, postReq); 

        },
        function(postReq, callback){

           
            var fileName = url.parse(postReq.fileurl).pathname.split('/').pop();

            var exec = require('child_process').exec,child;
            var wget = config.wget.command + postReq.fileurl + config.wget.output +fileName+'.mp4';

            child = exec(wget, function(err, stdout, stderr) {
                if (err) throw err;
                else {

                    console.log('====wget fun2: '+postReq.fileurl);
              
                    callback(null, postReq, fileName);
                
                }
            });

        },
        function(postReq, fileName, callback){
            //console.log(postReq.btype);
            var btypeVideoSize;
            var size = postReq.btype.split(',');
            if('' != size) {
                for(var n in size){
                    if(size[n]==="1080p"){
                        btypeVideoSize ="1920x1080";
                    }
                    else if(size[n]==="720p"){
                        btypeVideoSize ="1280x720";
                    }
                    else if(size[n]==="480p"){
                        btypeVideoSize ="854x480";
                    }
                    else if(size[n]==="360p"){
                        btypeVideoSize ="640x360";
                    }
                    console.log(n+":"+size[n]); 
                    console.log("btypeVideoSize:"+btypeVideoSize); 
                }
                
            }
           
           
            
            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input+fileName+'.mp4'; 
            var uuidFileName= uuid.v1();
            var outputVideo = config.ffmpeg.output+uuidFileName+'.mp4';

            var args = ['-i',inputVideo,'-pass','1','-vcodec',config.ffmpeg.vcodec,'-b:v',config.ffmpeg.inputBitrate,'-bt',config.ffmpeg.tolerance,'-threads','0','-qmin','10','-qmax','31','-g','30','-s',btypeVideoSize,'-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date()
                count = 0;
                
            ffmpeg.stdout.on('data',function(data){
                console.log('stdout:', data);
            });
            ffmpeg.stderr.on('data',function(data){
                //console.log('stderr:', data.toString());
                fs.appendFileSync(__dirname+config.ffmpeg.logfile, data.toString() );
            });
            ffmpeg.on('exit', function (code) {
                console.log('exit:'+code+' (0:Success 1:Fail) ');
                console.log('convert time:', ((new Date() - start) / 1000), 's');
                console.log('====ffmpeg fun3: '+outputVideo);
                callback(null, outputVideo);
            });
            
        },
        function(outputVideo,callback){


            var exec = require('child_process').exec,
            child;

            var mp4box = config.mp4box.command + outputVideo;

            child = exec(mp4box, function(err, stdout, stderr) {
                if (err) throw err;
                else{
       
                    console.log('====mp4box fun4: '+mp4box);
                    callback(null, 'done'); 
                } 
            });

           

        }
    ], function (err, result) {
        // result now equals 'done'    
    });
} 



