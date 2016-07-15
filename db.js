/**
 * Created by raghav on 15/7/16.
 */

var mysql = require('mysql');

var mysqlConfig = require('./config/mysql');

var state = {
    pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: mysqlConfig.MYSQL_HOST,
        user: mysqlConfig.MYSQL_USER,
        password: mysqlConfig.MYSQL_PASSWORD,
        database: mysqlConfig.MYSQL_DATABASE
    });
    done();
};

exports.get = function () {
    return state.pool
};
