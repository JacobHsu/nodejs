module.exports = function(app) {
    return {
        server: {
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
        files: {
            url : 'http://files/'
        },
        wget: { 
            command: 'wget --no-check-certificate ',
            output: ' -O ',
            dir: 'videos'
        },
        ffmpeg: { //https://www.ffmpeg.org/ffmpeg.html
            command  : 'ffmpeg',
            input    : 'videos/',
            output   : 'C:/xampp/htdocs/files/',
            vcodec   : 'libx264',
            inputBitrate :'100',
            tolerance : '100',
            //videoSize    : '640x360', //1080p：1920x1080 , 720p：1280x720, 480p：854x480, 360p：640x360
            outputBitrate : '600k',
            audioBitrate : '56k',
            audioChannels: '2',
            logfile: '/log/log.txt'
        }, 
        mp4box: {
            command: 'mp4box -inter 0.5 '//, Audio: 'mp4box -raw 2 '  -inter 0.5  
        },
        forks: {
            max: 4  
        }
    };
};