module.exports = function(app) {
    return {
        server: {
            port: 8000
        },
        mongodb: {
            host: 'localhost',
            port: 27017,
            db: 'mymongodb', 
            poolSize: 5
        },
        mysql: {
            host     : '127.0.0.1',
            user     : 'root',
            port     : '3306',
            password : 'yourpwd',
            database : 'test',
            connectionLimit : 10,
        }
    };
};