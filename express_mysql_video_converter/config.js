module.exports = function(app) {
    return {
        server: {
            host:'127.0.0.1',
            port: 8080
        },
        mysql: {
            host     : '127.0.0.1',
            user     : 'root',
            port     : '3306',
            password : 'yourpwd',
            database : 'test',
            connectionLimit : 10,
        },
        dbtable: {
            table: 'videoencoder'
        },
        wget: { 
            command: 'wget --no-check-certificate ',
            output: ' -O ',
            dir: 'videos'
        },
        ffmpeg: { //https://www.ffmpeg.org/ffmpeg.html
            command  : 'ffmpeg',
            input    : 'videos/',
            output   : 'public/',
            vcodec   : 'libx264',
            bitrate  :'100',
            tolerance : '100',
            //videoSize    : '640x360', //1080p：1920x1080 , 720p：1280x720, 480p：854x480, 360p：640x360
            outputBitrate:{ v1080p:'8000k', v720p:'5000k', v480p:'2500k', v360p:'1000k' },
            audioBitrate:{ v1080p:'384k', v720p:'384k', v480p:'128k', v360p:'128k' },
            audioChannels: '2',
            logfile: '/log/log.txt'
        }, 
        mp4box: {
            command: 'mp4box -inter 0.5 ' 
        },
        forks: {
            max: 4
        }
    };
};