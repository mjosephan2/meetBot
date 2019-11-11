var mysql = require("mysql");
var cfg = require("../config/config");
var _connectToDB = function () {
    var pool = mysql.createPool(cfg.config);
    return pool;
};
exports.pool = _connectToDB();
