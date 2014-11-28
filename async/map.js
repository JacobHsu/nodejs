var async = require('async');

var names = ["michael","richard","john","jennifer","ben","julie"];
async.map(names, getInfo, function (err, result) {
  if(!err) {
    console.log('Finished: ' + result);
  } else {
    console.log('Error: ' + err);
  }

});

function getInfo(name, callback) {
  setTimeout(function() {
    callback(null, name.toUpperCase());
  }, 1000);
}