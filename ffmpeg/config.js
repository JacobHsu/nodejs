module.exports = function(app) {
    return {
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
            audioChannels: '2'
        }
    };
};