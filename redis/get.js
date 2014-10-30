var redis = require("redis");
var http = require('http');
var url = require("url");
var info = "通过HTTPGet方式成功加入队列";
http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com
    console.log('params='+params.info);
    var client = redis.createClient();
    client.lpush("topnews", params.info);
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    client.lpop("topnews", function (i, o) {
        console.log('#'+i+':'+o);//回调，所以info可能没法得到o的值，就被res.write输出了
    })
    client.quit();
    res.write(info);
    res.end();
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');