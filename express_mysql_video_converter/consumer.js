global.config  = require('./config')();

var async = require('async');
var url = require("url");
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path')
var queue  = require('./queue');

process.on('message', function(videoReq) {

    async.waterfall([
        function(callback) {

           queue.start(videoReq.taskid, function(result) {
                console.log('========== [consumer] queue start '.bgBlue + result.bgRed);
                callback(null, result);
            });

        },
        function(queueStartResult,callback){ 

            var uuidFileName = uuid.v1();

            if (!fs.existsSync(config.wget.dir)) {
                fs.mkdirSync(config.wget.dir);
            }

            var extname = path.extname(videoReq.fileurl);
            var filepath = config.wget.dir + '/' + uuidFileName + extname;
            console.log(filepath);
            fs.exists(filepath, function(exists) {
                if (exists) {
                    var newUuidFileName = uuid.v1();
                    filepath = config.wget.dir + '/' + newUuidFileName + extname;
                }
            });

            var exec = require('child_process').exec,
                child;
            var wget = config.wget.command + videoReq.fileurl + config.wget.output + filepath;

            child = exec(wget, function(err, stdout, stderr) {
                if (err) {

                    queue.err(videoReq.taskid, function(result) {
                        process.send('[videoencoder] ' + videoReq.taskid + ' wget fail ' + err);
                    });

                } else {
                    //console.log('[videoencoder] wget : ' + videoReq.fileurl);
                    callback(null, uuidFileName, extname);
                }
            });


        },
        function(uuidFileName, extname, callback){ 

            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input + uuidFileName + extname;
            var args = ['-i', inputVideo, '-ss', '00:00:01', '-f', 'image2', '-vframes', '1', config.ffmpeg.input + uuidFileName + '.jpg'];

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args);

            var videoBtype;
            var videoDuration = 0;
            var ffmpegLog = '';

            ffmpeg.stdout.on('data', function(data) {
                console.log('stdout:', data);
            });

            ffmpeg.stderr.on('data', function(data) {
                ffmpegLog = ffmpegLog + data.toString();
            });
            ffmpeg.on('exit', function(code) {

                if (code == 0) {

                    var size = (ffmpegLog) ? ffmpegLog.match(/Video: mjpeg, (.*?),(.*?)x(.*?),/g) : [];
                    if (size) {
                        var btype = size[0].split("x");
                        var reg = /[^\d]/g;
                        videoBtype = btype[1].substr(0, 4).replace(reg, "");
                    }

                    var totalTime = (ffmpegLog) ? ffmpegLog.match(/Duration: (.*?), start:/) : [];
                    if (totalTime) {
                        var rawDuration = totalTime[1];
                        var arHMS = rawDuration.split(":").reverse();
                        videoDuration = parseFloat(arHMS[0]);
                        if (arHMS[1]) videoDuration += parseInt(arHMS[1]) * 60;
                        if (arHMS[2]) videoDuration += parseInt(arHMS[2]) * 60 * 60;
                    }

                    var ffmpegDebugLog = '{ffmpeg_check_video : [videoBtype:' + videoBtype + ',videoDuration:' + videoDuration + ']}';
                    queue.updateLog(ffmpegLog + ffmpegDebugLog, videoReq.taskid, function(result) {
                        console.log('size: ' + size[0]);
                        console.log('totalTime: ' + totalTime);
                        console.log('videoBtype: ' + videoBtype);
                        console.log('videoDuration: ' + videoDuration);
                    });

                    if (videoBtype && videoDuration) {
                            callback(null, uuidFileName, extname, videoBtype, videoDuration);
                    } else {
                        queue.err(videoReq.taskid, function(result) {
                            console.log('[videoencoder] videoBtype or videoDuration : FAIL!!!');
                        });
                    }


                } else {
                    console.log('[videoencoder] ffmpeg Check: FAIL!!!');
                    queue.err(videoReq.taskid, function(result) {
                        process.send('[videoencoder] ' + videoReq.taskid + ' ffmpeg check fail ' + err);
                    });
                }


            });



        },
        function(uuidFileName, extname, videoBtype, videoDuration, callback){ 

            var command = config.ffmpeg.command;
            var inputVideo = config.ffmpeg.input + uuidFileName + extname;
            var outputVideoName = config.ffmpeg.output + uuidFileName;
            var outputVideo, outputVideoArray = [];

            var input_args = ['-i', inputVideo, '-pass', '1', '-vcodec', config.ffmpeg.vcodec, '-b:v', config.ffmpeg.bitrate , '-bt', config.ffmpeg.tolerance, '-threads', '0', '-qmin', '10', '-qmax', '31', '-g', '30'];

            var args = input_args;
            var size = videoReq.btype.split(',');
            if ('' != size) {
                for (var n in size) {
                    if (size[n] === "1080p" && videoBtype >= 1080) {
                        outputVideo = outputVideoName + '-1080p.mp4';
                        output_args = ['-s', '1920x1080', '-b', config.ffmpeg.outputBitrate1080p, '-ab', config.ffmpeg.audioBitrate1080p, '-ac', config.ffmpeg.audioChannels, outputVideo];
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    } else if (size[n] === "720p" && videoBtype >= 720) {
                        outputVideo = outputVideoName + '-720p.mp4';
                        output_args = ['-s', '1280x720', '-b', config.ffmpeg.outputBitrate720p, '-ab', config.ffmpeg.audioBitrate720p, '-ac', config.ffmpeg.audioChannels, outputVideo];
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    } else if (size[n] === "480p" && videoBtype >= 480) {
                        outputVideo = outputVideoName + '-480p.mp4';
                        output_args = ['-s', '854x480', '-b', config.ffmpeg.outputBitrate480p, '-ab', config.ffmpeg.audioBitrate480p, '-ac', config.ffmpeg.audioChannels, outputVideo];
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    } else if (size[n] === "360p") {
                        outputVideo = outputVideoName + '-360p.mp4';
                        output_args = ['-s', '640x360', '-b', config.ffmpeg.outputBitrate360p, '-ab', config.ffmpeg.audioBitrate360p, '-ac', config.ffmpeg.audioChannels, outputVideo];
                        args = args.concat(output_args);
                        outputVideoArray.push(outputVideo);
                    }
                }

            }


            var str = args.toString()
            var commandstr = str.replace(/,/g, " ");
            //console.log('ffmpeg command:'+commandstr);
            callback(null, command, args, outputVideoArray.length, outputVideoArray, videoDuration);

        },
        function(command, args, count, outputVideoArray, videoDuration, callback){ 
            
            process.stdout.write('◢▆▅▄▃[videoencoder] ffmpeg : ');

            var spawn = require('child_process').spawn,
                ffmpeg = spawn(command, args),
                start = new Date();

            ffmpeg.stdout.on('data', function(data) {
                console.log('stdout:', data);
            });

            var time = 0;
            var ffmpegLog ='';
            
            ffmpeg.stderr.on('data', function(data) {

                ffmpegLog = ffmpegLog + data.toString(); 
                var content = data.toString();

                var getTime = content.match(/time=(.*?) bitrate/g);
                if (getTime) {

                    var rawTime = getTime[0].replace('time=', '').replace(' bitrate', '');

                    arHMS = rawTime.split(":").reverse();
                    time = parseFloat(arHMS[0]);
                    if (arHMS[1]) time += parseInt(arHMS[1]) * 60;
                    if (arHMS[2]) time += parseInt(arHMS[2]) * 60 * 60;

                    var progress = Math.round((time / videoDuration) * 100);
                    if (progress) {
                        queue.updateProgress(progress, videoReq.taskid, function(result) {
                            //process.stdout.write(' ▅[#' + result + '==' + progress + "%" + "]▅ ");
                        });

                    }

                }


            });
            ffmpeg.on('exit', function(code) {

                    if (code == 0) {

                        queue.updateProgress(100, videoReq.taskid, function(result) {
                            console.log('#' + videoReq.taskid + '#' + '▃▄▅▇◣');
                        });

                        var convert_time = (new Date() - start) / 1000;
                        console.log('[videoencoder] #' + videoReq.taskid  +' convert time:' + convert_time + 's');
                        console.log('[videoencoder] ffmpeg : ' + count + ' videos');

                        var ffmpegDebugLog ='{ffmpeg_video_encoder : [convert_time:'+convert_time+',convert_videos:'+count+']}';
                        queue.updateLog(ffmpegLog +ffmpegDebugLog , videoReq.taskid, function(result) {
                            callback(null, outputVideoArray);
                        });


                    } else
                        console.log('[videoencoder] ffmpeg : FAIL!!!');


            });
            
        },
        function(outputVideoArray,callback){
            
            async.map(outputVideoArray, mp4boxExeMap, function(err, result) {
                if (!err) {

                    var fileName = url.parse(videoReq.fileurl).pathname.split('/').pop().split('.').shift();
                    var videoHash = url.parse(videoReq.fileurl).pathname.split('/').slice(-2).shift();

                    var jsonObj = new Object();
                    jsonObj.files = result;
                    jsonObj.filename = fileName;
                    jsonObj.videoHash = videoHash;

                    require('./request')(jsonObj, videoReq.recipient, function(result) {
                        console.log('[videoencoder] callback request:' + videoHash + JSON.stringify(result)); 
                        callback(null, {
                            taskid: videoReq.taskid,
                            state: 'Finished'
                        });
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
process.on('SIGHUP', function() {
    process.exit();
});


function mp4boxExeMap(outputVideo, callback) {

    var exec = require('child_process').exec,
        child;
    var mp4box = config.mp4box.command + outputVideo;

    child = exec(mp4box, function(err, stdout, stderr) {
        if (err) throw err;
    });
    child.on('exit', function(code) {
        //console.log('[videoencoder] mp4box : ' + mp4box.slice(-25) + ' exit:' + code + ' (0:Success 1:Fail) ');
        var fileurl = config.files.url + mp4box.split('/').pop();
        callback(null, fileurl);
    });
}


