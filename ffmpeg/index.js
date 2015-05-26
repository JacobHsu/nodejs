global.config  = require('./config')();
var colors = require('colors');
var async = require('async');

async.waterfall([
    function(callback){

        console.log('====================Fun1 Check Size========================'.bgGreen);
        var command = config.ffmpeg.command;
        var inputVideo = config.ffmpeg.input+'testvideo.mp4'; 
        args = ['-i',inputVideo]; //test

        var spawn = require('child_process').spawn,
            ffmpeg = spawn(command, args),
            start = new Date()

        ffmpeg.stdout.on('data',function(data){
            console.log('stdout:', data);
        });

        ffmpeg.stderr.on('data',function(data){
           //console.log('stderr:', data.toString());
           
            var content = data.toString();
            var size = (content) ? content.match(/p,(.*?)x(.*?),/g) : []; 
            if(size)
            {
               console.log(size[0].yellow);
               var btype = size[0].split("x");
               var reg=/[^\d]/g;
               var videoBtype = btype[1].substr(0,4).replace(reg, "");
               console.log('video btype='+ videoBtype.yellow);

               callback(null, inputVideo, videoBtype);
            }

        });

    },
    function(inputVideo, videoBtype, callback){

        var args = ['-i', inputVideo, '-ss', '00:00:01', '-f', 'image2', '-vframes', '1', config.ffmpeg.input + 'testvideo.jpg'];
        var command ='ffmpeg';
        var spawn = require('child_process').spawn,
            ffmpeg = spawn(command, args);

        var videoBtype = 0;
        var videoDuration = 0;
        var ffmpegLog = '';

        ffmpeg.stdout.on('data', function(data) {
            console.log('stdout:', data);
        });

        ffmpeg.stderr.on('data', function(data) {
            ffmpegLog = ffmpegLog + data.toString();
        });
        ffmpeg.on('exit', function(code) {

            if (code !== 0) {
                return;
            }
            //全部組合完再找
            console.log('==================== Fun1.2 Check videoDuration ========================'.bgGreen);
            //console.log(ffmpegLog);


            var size = (ffmpegLog) ? ffmpegLog.match(/Video: mjpeg, (.*?),(.*?)x(.*?),/g) : [];
            if (size) {
                var btype = size[0].split("x");
                var reg = /[^\d]/g;
                videoBtype = btype[1].substr(0, 4).replace(reg, "");
            }

            var totalTime = (ffmpegLog) ? ffmpegLog.match(/Duration: (.*?), start:/) : [];
            if (totalTime) {
                console.log(totalTime[0].yellow);
                var rawDuration = totalTime[1];
                var arHMS = rawDuration.split(":").reverse();
                videoDuration = parseFloat(arHMS[0]);
                if (arHMS[1]) videoDuration += parseInt(arHMS[1]) * 60;
                if (arHMS[2]) videoDuration += parseInt(arHMS[2]) * 60 * 60;
                console.log('[videoDuration]='.yellow+videoDuration);

                callback(null, videoBtype, videoDuration);
            }


        });



    },
    function(videoBtype, videoDuration, callback){

        console.log('====================Fun2 Command========================'.bgGreen);

        var command = config.ffmpeg.command;
        var inputVideo = config.ffmpeg.input+'testvideo.mp4'; 
        var outputVideoName = 'ouputvideo'; //config.ffmpeg.output+
        var outputVideo,outputVideoArray=[];

        var input_args = ['-i',inputVideo,'-pass','1','-vcodec',config.ffmpeg.vcodec,'-b:v',config.ffmpeg.inputBitrate,'-bt',config.ffmpeg.tolerance,'-threads','0','-qmin','10','-qmax','31','-g','30']; 

        var args = input_args;

        var videoReqBtype = '1080p,720p,480p,360p';
        var size = videoReqBtype.split(',');
        if('' != size) {
            for(var n in size){
                if(size[n]==="1080p" && videoBtype >=1080 ){ 
                    outputVideo = outputVideoName+'-1080p.mp4';
                    output_args = ['-s','1920x1080','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
                    args = args.concat(output_args);
                    outputVideoArray.push(outputVideo);
                }
                else if(size[n]==="720p" && videoBtype >=720){
                    outputVideo = outputVideoName+'-720p.mp4';
                    output_args = ['-s','1280x720','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo]; 
                    args = args.concat(output_args);
                    outputVideoArray.push(outputVideo);
                }
                else if(size[n]==="480p" && videoBtype >=480){
                    outputVideo = outputVideoName+'-480p.mp4';
                    output_args = ['-s','854x480','-b',config.ffmpeg.outputBitrate,'-ab',config.ffmpeg.audioBitrate,'-ac',config.ffmpeg.audioChannels, outputVideo];
                    args = args.concat(output_args); 
                    outputVideoArray.push(outputVideo);
                }
                else if(size[n]==="360p" && videoBtype >=360){
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

        callback(null, command, args, videoDuration, outputVideoArray.length);
    },
    function(command, args, videoDuration, count, callback){

        console.log('====================Fun3 Encoder========================'.bgGreen);
        console.log('[videoencoder] videoDuration : '+videoDuration);
        console.log('[videoencoder] ffmpeg : ');

        var spawn = require('child_process').spawn,
            ffmpeg = spawn(command, args),
            start = new Date()

        ffmpeg.stdout.on('data',function(data){
            console.log('stdout:', data);
        });

        var duration = 0, time = 0, progress = 0;

        ffmpeg.stderr.on('data',function(data){
           console.log('stderr:', data.toString());
           
            var content = data.toString();

            var getTime = content.match(/time=(.*?) bitrate/g);
            if (getTime) {

                console.log('[getTime] '.bgBlue+ getTime);

                var rawTime = getTime[0].replace('time=', '').replace(' bitrate', '');

                arHMS = rawTime.split(":").reverse();
                time = parseFloat(arHMS[0]);
                if (arHMS[1]) time += parseInt(arHMS[1]) * 60;
                if (arHMS[2]) time += parseInt(arHMS[2]) * 60 * 60;

                // console.log('time:');
                // console.log(time);
                // console.log('videoDuration:');
                // console.log(videoDuration);
                 var progress = Math.round((time / videoDuration) * 100);
                 // console.log('progress:');
                 // console.log(progress);
                 process.stdout.write( "\#"+progress+"% ");

            }

            //fs.appendFileSync(__dirname+config.ffmpeg.logfile, data.toString() );

        });
        ffmpeg.on('exit', function (code) {
            //fs.appendFileSync(__dirname+config.ffmpeg.logfile, '~~~~~~~~~~~~~~~~~~~~~~~');
            console.log('exit:'+code+' (0:Success 1:Fail) ');
            
            if(code==0){
                console.log('convert time:', ((new Date() - start) / 1000), 's');
                console.log('[videoencoder] ffmpeg : '+count+' videos');
            }
            else
                console.log('[videoencoder] ffmpeg : FAIL!!!');

             callback(null, 'three');
        });

       
    }
], function (err, result) {
  // result now equals 'done'
});
