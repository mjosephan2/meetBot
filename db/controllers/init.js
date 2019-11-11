var mysql = require("mysql");
var cfg = require("../config/development.json");
var _getDBCreds = function () {
    var dbCreds = {
        host: cfg.db_details.host,
        port: cfg.db_details.port,
        user: cfg.db_details.usr,
        password: cfg.db_details.pwd,
        database: cfg.db_details.database,
        connectionLimit: cfg.db_details.conn_count,
        dateStrings : true
    };
    return dbCreds;
};
var _connectToDB = function () {
    var pool = mysql.createPool(_getDBCreds());
    return pool;
};
exports.pool = _connectToDB();
