
var http = require('http');
var url = require('url');


function start(route, handle) {
	function onRequest(request, response) {

		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");

		//設定了接收資料的編碼格式為UTF-8
		request.setEncoding("utf8");

		//註冊了 "data" 事件的監聽器
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			console.log("Received POST data chunk '"+postDataChunk + "'.");
		});

		//將請求路由的執行移到end事件處理程序中
		request.addListener("end", function() {
			route(handle, pathname, response, postData);
		});

	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started. Time:" + new Date());
}

exports.start = start;



