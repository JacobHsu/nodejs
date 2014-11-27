pollingLoop();

function pollingLoop(){ 

	var cp = require('child_process');
	var child = cp.fork('./worker');

	var num = Math.floor((Math.random() * 100) + 1);

	child.on('message', function(m) {
		// Receive results from child process
		console.log('Child process started: %d', child.pid);
		console.log('received: ' + m);
	});

	// Send child process some work
   child.send({ word: 'Please up-case this string', random: num});

   setTimeout(pollingLoop, 3000);
}