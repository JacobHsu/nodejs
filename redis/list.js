	var redis = require('redis'),
	    client = redis.createClient();

	var arr = ["some val","some val2","some val3"];
	//Use multi() to pipeline multiple commands at once
	var multi = client.multi();

	for (var i=0; i<arr.length; i++) {
		//console.log(arr[i]);
	    //將一個或多個值value插入到列表key的表尾。
	    multi.rpush('testlist', arr[i]);
	    
	}

	multi.exec(function(err, response) {
		if(err) throw err; 

	})

/* SHOW ALL LIST ITEMS--*/
	client.lrange('testlist', 0, -1, function (error, items) {
	  if (error) throw error

	  items.forEach(function (item) {
	   /// processItem(item)
	   console.log(item);
	  })
	  console.log('===');
	})


	// LPOP移除并返回列表key的头元素。
	// blpop LPOP命令的阻塞版本
	client.blpop('testlist', 0, function(err, data) {
		console.log(' blpop: ' + data[1]);
	});



