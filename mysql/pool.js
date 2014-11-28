var mysql = require('mysql');


var pool  = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : 'yourpwd',
  database : 'test'
});

pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
      // Use the connection
      connection.query( 'SELECT * FROM user_info', function(err, rows) {
        // And done with the connection.
        console.log(rows[0].userName);
        connection.release();

        // Don't use the connection here, it has been returned to the pool.
      });
});
