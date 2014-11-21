var url = require("url");
var fileurl='http://upload/video/085dda8c813c23b9/f512f29f0133.mp4';
var videoHash = url.parse(fileurl).pathname.split('/').slice(-2).shift(); //085dda8c813c23b9
console.log(videoHash);
var fileName = url.parse(fileurl).pathname.split('/').pop().split('.').shift();
// [ '', 'video', '085dda8c813c23b9', 'f512f29f0133.mp4' ] -> f512f29f0133.mp4 -> [ 'f512f29f0133',  'mp4' ] -> f512f29f0133
console.log(fileName);

