/**
 * 測試資料
 * @param   .MP4 7 MB https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0
 * @param   .MP4 688 KB  https://googledrive.com/host/0B8p3dPzRohcnU2JWNGl3MTU5OFk
 */

// Function to download file using wget
var download_file_wget = function(file_url) {

    var url = require("url");
    // extract the file name
    var file_name = url.parse(file_url).pathname.split('/').pop();
    // compose the wget command
    //var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;

    // excute wget using child_process' exec function
    var exec = require('child_process').exec,
    child;
    var wget = 'wget --no-check-certificate ' + file_url +' -O FILENAME4.mp4';
    child = exec(wget, function(err, stdout, stderr) {
        if (err) throw err;
        else console.log(file_name + ' downloaded to ' + 'DOWNLOAD_DIR');
    });
};

//wget --no-check-certificate  https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0 -O FILENAME4.mp4'
download_file_wget('https://googledrive.com/host/0B8p3dPzRohcnZUw4M0RqVjkxUE0');
//var tmp = require('temporary');
//var file = new tmp.File();
//console.log(file.path); // path.