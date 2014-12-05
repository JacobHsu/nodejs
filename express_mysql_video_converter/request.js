var request = require("request");

module.exports = function (httpReqJSON, httpRecipient, module_callback){
	console.log('[request] httpRecipient:'+httpRecipient);
	var options = {
		uri: httpRecipient,
		method: 'POST',
		json: httpReqJSON
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			module_callback(body);
		}
	});

}