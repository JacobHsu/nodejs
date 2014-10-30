var redis = require("redis"),
        client = redis.createClient();

   var info = {};
        info.baidu = 'www.baidu.com';
        info.sina  = 'www.sina.com';
        info.qq    = 'www.qq.com';

        client.hmset('site', info);

	client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");


	client.hgetall("hosts", function (err, obj) {
	   // console.dir(obj);
	});

	client.hgetall("site", function (err, obj) {
	    console.dir(obj);
	});




