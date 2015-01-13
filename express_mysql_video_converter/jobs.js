global.mysql   = require('./mysql');

module.exports = new mysqldb;

function mysqldb() {
    mysql.start(config.mysql);
}

mysqldb.prototype.start = function(qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET state = 1, log="{start}" WHERE id=?', [qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid + ' start');
    });
}

mysqldb.prototype.finish = function(qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET state = 2 WHERE id=?', [qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid + ' finish');
    });
}

mysqldb.prototype.err = function(qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET state = 4 WHERE id=?', [qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid + ' error');
    });
}

mysqldb.prototype.updateProgress = function(progress, qid, my_callback) {

    mysql.execSql('UPDATE ' + config.dbtable.table + ' SET progress = ? WHERE id=?', [progress, qid], function(err, rows) {
        if (err) {
            my_callback("Couldn't UPDATE ", null);
            return;
        }
        my_callback(qid);
    });
}

mysqldb.prototype.queryProgress = function(qid, my_callback) {

    mysql.execSql('SELECT progress FROM ' + config.dbtable.table + ' where videoid=? limit 1', [qid], function(err, rows) {

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