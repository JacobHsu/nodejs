global.config  = require('./config')();
var async = require('async');
var url = require("url");
var uuid = require('node-uuid');
var fs = require('fs');


module.exports = function (postReq, module_callback){

    async.waterfall([
        function(callback){ 

            var uuidFileName = uuid.v1();
            var path = config.wget.dir +uuidFileName+'.mp4';
     
            fs.exists(path, function(exists) {
                if (exists) {
                    var newUuidFileName = uuid.v1();
                    path = config.wget.dir +newUuidFileName+'.mp4';
                }
            });

            var exec = require('child_process').exec,child;
            var wget = config.wget.command + postReq.fileurl + config.wget.output + path;

            child = exec(wget, function(err, stdout, stderr) {
                if (err) throw err;
                else {
                    console.log('[videoencoder] wget : '+postReq.fileurl);
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
            //console.log('ffmpeg command:'+commandstr);
            console.log('[videoencoder] ffmpeg : ');

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date()
 
            ffmpeg.stdout.on('data',function(data){
                console.log('stdout:', data);
            });
            ffmpeg.stderr.on('data',function(data){
                //console.log('stderr:', data.toString());
                process.stdout.write("\#%");

                fs.appendFileSync(__dirname+config.ffmpeg.logfile, data.toString() );

            });
            ffmpeg.on('exit', function (code) {
                fs.appendFileSync(__dirname+config.ffmpeg.logfile, '~~~~~~~~~~~~~~~~~~~~~~~');
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

                    var filesJSON = '{"files":'+JSON.stringify(result)+'}';
                    require('./request')(filesJSON, postReq.recipient ,function (result) {          
                        console.log('[videoencoder] callback request:'+result);
                        callback(null, 'Finished'); 
                    });

                     
                } else {
                    console.log('Error: ' + err);
                }
            });
        }
    ], function (err, result) {   
         module_callback(result);
    });
} 

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


