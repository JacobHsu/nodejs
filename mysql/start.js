global.mysql   = require('./mysql');
global.config  = require('./config')();

    mysql.start(config.mysql);

    var usesql  = require('./sql');
    usesql.querydb(null, function(result){
        console.log(result);
    });

    var post  = { userName: 'Hello MySQL'};
    usesql.insertdb(post, function(result){
        console.log(result);
    });


    


