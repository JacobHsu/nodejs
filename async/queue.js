var async = require('async');
// create a queue object with concurrency 2
var q = async.queue(function (task, callback) {
    console.log('hello ' + task.name);
    callback();
}, 2);


// assign a callback
q.drain = function() {
    console.log('all items have been processed');
}

// add some items to the queue
q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function (err) {
    console.log('finished processing bar');
});

// add some items to the front of the queue
q.unshift({name: 'front'}, function (err) {
    console.log('finished processing front');
});