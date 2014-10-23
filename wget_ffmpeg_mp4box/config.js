module.exports = function() {
    var config = {
        server: {
            port: 8888
        },
        wget: { // 'wget --no-check-certificate ' + fileUrl +' -O videos/'+fileName+'.mp4'
            command: 'wget --no-check-certificate ',
            output: ' -O videos/'
        },
        ffmpeg: { //https://www.ffmpeg.org/ffmpeg.html
            command  : 'ffmpeg',
            input    : 'videos/',
            output   : 'output/',
            vcodec   : 'libx264',
            inputBitrate :'100',
            tolerance : '100',
            videoSize    : '640x360', //1080p：1920x1080 , 720p：1280x720, 480p：854x480, 360p：640x360
            outputBitrate : '600k',
            audioBitrate : '56k',
            audioChannels: '2'
        }, 
        mp4box: {
            command: 'mp4box -split 6 '//, //mp4box -inter 0.5 
        }
    }
    return config;
}