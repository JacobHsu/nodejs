var redis = require("redis"),
        client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print); //Reply: OK
    client.hset("hash key", "hashtest 1", "some value", redis.print); //Reply: 0
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print); //Reply: 0

  
    client.hkeys("hash key", function (err, replies) {
        console.log( "---------hkeys---------------");
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

    client.hgetall("hash key", function (err, obj) {
        console.log( "---------hgetall--------------");
        console.dir(obj);

         for(var key in obj) {
            console.log( key+"="+obj[key] );
        }
    });





