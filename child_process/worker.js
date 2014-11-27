process.on('message', function(m) {
	
	// Do work  (in this case just up-case the string
	word = m.word.toUpperCase();
	num = m.random; 
	// Pass results back to parent process
	process.send(word+' '+num);
});
