var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/* GET home page. */
router.get('/', function (req, res, next) {
    var queries = require('../queries');
    var done = (function (rows) {
        var banks = [];
        for (var i = 0; i < rows.length; i++) {
            banks.push({
                bank_id: rows[i].bank_id,
                bank_title: rows[i].bank_title
            });
        }
        res.render('index', {title: 'Banks', banks: banks});
    });
    queries.getAllBanks(done);
});

router.post('/city-suggestions', function (req, res, next) {
    var queries = require('../queries');
    var done = (function (rows) {
        var data = {
            cities: {},
            branches: {}
        };
        for (var i in rows) {
            var bank = encodeURI(rows[i].bank_title);
            var city = encodeURI(rows[i].city);
            if (!(city in data.cities)) {
                data.cities[city] = rows[i].city;
            }
            if (!(bank in data.branches)) {
                data.branches[bank] = {};
            }
            if (!(city in data.branches[bank])) {
                data.branches[bank][city] = [];
            }
            data.branches[bank][city].push({
                ifsc: rows[i].ifsc,
                bank: rows[i].bank_title,
                branch: rows[i].branch,
                city: rows[i].city
            });
        }
        res.send(data);
    });
    console.log(req.query.bank_id, req.query.cityStr);
    queries.getBranchesByBankAndCityStr(req.query.bank_id, req.query.cityStr, done);
});

module.exports = router;
