/**
 * 測試資料
 * @param   .MP4 7 MB https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0
 * @param   .MP4 688 KB  https://googledrive.com/host/0B8p3dPzRohcnU2JWNGl3MTU5OFk
 * @tags #child_process #spawn #ffmpeg
 */
var config  = require('./config')();

var async = require('async');
var url = require("url");
var uuid = require('node-uuid');

function videoEncoder(){

    async.waterfall([
        function(callback){

            var fileUrl = 'https://googledrive.com/host/0B8p3dPzRohcnU2JWNGl3MTU5OFk'; //600k
            //var fileUrl = 'https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0'; //7M
            callback(null, fileUrl); 

        },
        function(fileUrl, callback){

            
            var fileName = url.parse(fileUrl).pathname.split('/').pop();

            var exec = require('child_process').exec,child;
            var wget = config.wget.command + fileUrl + config.wget.output +fileName+'.mp4';

            child = exec(wget, function(err, stdout, stderr) {
                if (err) throw err;
                else {

                    console.log('====wget fun2: '+fileUrl);
              
                    callback(null, fileName);
                
                }
            });

        },
        function(fileName, callback){
 
            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input+fileName+'.mp4'; 
            var uuidFileName= uuid.v1();
            var outputVideo = config.ffmpeg.output+uuidFileName+'.mp4';

            var args = ['-i',inputVideo,'-pass','1','-vcodec',config.ffmpeg.vcodec,'-b:v',config.ffmpeg.inputBitrate,'-bt',config.ffmpeg.tolerance,'-threads','0','-qmin','10','-qmax','31','-g','30','-s',config.ffmpeg.videoSize,'-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo];

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date()
                count = 0;
                
            ffmpeg.stdout.on('data',function(data){
                console.log('stdout:', count++);
            });
            ffmpeg.stderr.on('data',function(data){
                console.log('stderr:', data.toString());
            });
            ffmpeg.on('exit', function (code) {
                console.log('exit:'+code);
                console.log('convert time:', ((new Date() - start) / 1000), 's');
                console.log('====ffmpeg fun3: '+outputVideo);
                callback(null, outputVideo);
            });

        },
        function(outputVideo,callback){


            var exec = require('child_process').exec,
            child;

            var mp4box = config.mp4box.command + outputVideo;//config.mp4box.output;

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

videoEncoder();

