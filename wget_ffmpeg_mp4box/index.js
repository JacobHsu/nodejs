/**
 * 測試資料
 * @param   .MP4 7 MB https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0
 * @param   .MP4 688 KB  https://googledrive.com/host/0B8p3dPzRohcnU2JWNGl3MTU5OFk
 * @tags #child_process #spawn #ffmpeg
 */

function videoEncoder(){

    var async = require('async');

    async.waterfall([
        function(callback){

            //var fileUrl = 'https://googledrive.com/host/0B8p3dPzRohcnU2JWNGl3MTU5OFk'; //600k
            var fileUrl = 'https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0'; //7M
            callback(null, fileUrl); 

        },
        function(fileUrl, callback){

            var url = require("url");
            var fileName = url.parse(fileUrl).pathname.split('/').pop();

            var exec = require('child_process').exec,child;
            var wget = 'wget --no-check-certificate ' + fileUrl +' -O videos/'+fileName+'.mp4'; //'/video/'+
            child = exec(wget, function(err, stdout, stderr) {
                if (err) throw err;
                else {

                    console.log('fun2: '+fileUrl);
              
                    callback(null, fileName);
                
                }
            });

        },
        function(fileName, callback){
  
            var command = 'ffmpeg';
            var inputVideo = 'videos/'+fileName+'.mp4'; //
            var outputVideo = 'output/OUTPUT4.mp4';

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, ['-i',inputVideo,'-pass','1','-vcodec','libx264','-b:v','100','-bt','100','-threads','0','-qmin','10','-qmax','31','-g','30','-s','640x360','-b','600k','-ab','56k','-ac','2', outputVideo]),
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
                console.log('fun3: '+inputVideo);
                callback(null, inputVideo);
            });

        },
        function(inputVideo,callback){


            var exec = require('child_process').exec,
            child;
            //var mp4box = 'mp4box test.mp4 -inter 0.5';
            var mp4box = "MP4Box -split 6 output/OUTPUT4.mp4";

            child = exec(mp4box, function(err, stdout, stderr) {
                if (err) throw err;
                else{
       
                    console.log('fun4: MP4Box'+inputVideo);
                    callback(null, 'done'); 
                } 
            });

           

        }
    ], function (err, result) {
        // result now equals 'done'    
    });
} 

videoEncoder();