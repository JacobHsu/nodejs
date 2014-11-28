module.exports = new mysqldb;

function mysqldb(){    
}

mysqldb.prototype.querydb = function(uid, my_callback) {
    mysql.execSql('SELECT * FROM user_info', [], function (err, rows) {        
        if (!rows[0]) {
            my_callback("Couldn't find user", null);
            return;
        }
        my_callback(rows[0]);
    });    
}


mysqldb.prototype.insertdb = function(post, my_callback) {
	console.log(post);
    mysql.execSql('INSERT INTO user_info SET ?', post, function (err, rows) {        
        my_callback('==========  insert ==========');
    });    
}





