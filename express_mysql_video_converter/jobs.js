global.mysql   = require('./mysql');

module.exports = new mysqldb;

function mysqldb() {
    mysql.start(config.mysql);
}

mysqldb.prototype.updateState = function(state, qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET state = ? WHERE id=?', [state, qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE State ( start=1 / finish=2 / err=3,4,5,6 )", null);
            return;
        }
        my_callback(qid);
    });
}

mysqldb.prototype.updateProgress = function(progress, qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET progress = ? WHERE id=?', [progress, qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE Progress", null);
            return;
        }
        my_callback(qid);
    });
}

mysqldb.prototype.queryProgress = function(qid, my_callback) {

    mysql.execSql('SELECT progress FROM ' + config.dbtable.table + ' where id=? limit 1', [qid], function(err, rows) {

        if (err) {
            console.log(err);
            my_callback('queue null');
        } else {
            my_callback(rows[0]);
        }

    });
}

mysqldb.prototype.updateLog = function(log, qid, my_callback) {

    mysql.execSql('SELECT log FROM ' + config.dbtable.table + ' WHERE id=?', [qid], function(err, rows) {

        mysql.execSql('UPDATE ' + config.dbtable.table + ' SET log = ? WHERE id=?', [rows[0].log + log, qid], function(err, rows) {
            if (err) {
                console.log(err);
            }
        });

        my_callback(null);
    });
}