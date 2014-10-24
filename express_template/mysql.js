var mysql   = require('mysql');

exports.start = function (config) {     
    this.pool = mysql.createPool(config);
}

exports.query = function(string, arg, callback) {
    this.pool.getConnection(function(err, connection) {  
        if (err) throw err;
        connection.query(string, arg, function (err, rows){
            if (err) throw err;
            connection.end();
            callback(err, rows);            
        });
    });
}