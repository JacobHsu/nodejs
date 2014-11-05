global.config  = require('./config')();
var async = require('async');
var url = require("url");
var uuid = require('node-uuid');
var fs = require('fs');


module.exports = function (postReq, my_callback){

    async.waterfall([
        function(callback){ 

            var fileName = url.parse(postReq.fileurl).pathname.split('/').pop();

            var exec = require('child_process').exec,child;
            var wget = config.wget.command + postReq.fileurl + config.wget.output +fileName+'.mp4';

            child = exec(wget, function(err, stdout, stderr) {
                if (err) throw err;
                else {
                    console.log('[videoencoder] wget : '+postReq.fileurl);
                    callback(null, fileName); 
                }
            });

        },
        function(fileName, callback){ 
            
            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input+fileName+'.mp4'; 
            var uuidFileName = uuid.v1();
            var outputVideoName = config.ffmpeg.output+uuidFileName;
            var outputVideo,outputVideoArray=[];

            var input_args = ['-i',inputVideo,'-pass','1','-vcodec',config.ffmpeg.vcodec,'-b:v',config.ffmpeg.inputBitrate,'-bt',config.ffmpeg.tolerance,'-threads','0','-qmin','10','-qmax','31','-g','30']; 

            var args = input_args;
            var size = postReq.btype.split(',');
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
            console.log('ffmpeg command:'+commandstr);

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date()
 
            ffmpeg.stdout.on('data',function(data){
                console.log('stdout:', data);
            });
            ffmpeg.stderr.on('data',function(data){
                //console.log('stderr:', data.toString());
                fs.appendFileSync(__dirname+config.ffmpeg.logfile, data.toString() );
            });
            ffmpeg.on('exit', function (code) {
               
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
                console.log('[videoencoder] mp4box Finished: ' + result);
                callback(null, 'Finished');  
              } else {
                console.log('Error: ' + err);
              }

            });
        }
    ], function (err, result) {   
         my_callback(result);
    });
} 

function mp4boxExeMap(outputVideo, callback) {

    var exec = require('child_process').exec,child;
    var mp4box = config.mp4box.command  + outputVideo;

    child = exec(mp4box, function(err, stdout, stderr) {
        if (err) throw err;
    });  
    child.on('exit', function (code) {
        console.log('[videoencoder] mp4box : '+mp4box+' exit:'+code+' (0:Success 1:Fail) ');
        callback(null, mp4box.slice(-9)); 
    });
}


