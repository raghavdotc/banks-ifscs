/**
 * Created by raghav on 15/7/16.
 */

var db = require('./db');

exports.getAllBanks = function (done) {
    var done1 = function () {
        db.get().query('SELECT * from banks', function (err, result) {
            if (err) return "Error";
            done(result);
        })
    };
    db.connect(done1);
};

exports.getBranchesByBankAndCityStr = function (bank_id, cityStr, done) {
    var done1 = function () {
        var sql = 'select cities.city, branches.*, banks.bank_title from branches ' +
            'inner join cities on cities.city_id = branches.city_id ' +
            'inner join banks on banks.bank_id = branches.bank_id ' +
            'where branches.bank_id = ' + bank_id + ' and city LIKE "%' + cityStr.toUpperCase() + '%"';
        db.get().query(sql,
            function (err, rows) {
                if (err) return done(err);
                done(rows)
            })
    };
    db.connect(done1);
};
