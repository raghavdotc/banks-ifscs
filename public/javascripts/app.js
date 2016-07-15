/**
 * Created by raghav on 14/7/16.
 */


var app = angular.module('banks', []);

app.controller("BankController", function ($scope, $http) {

    this.cityAutoSuggestOn = false;

    this.bank = "";

    this.bank_title = "";

    this.city = "";

    this.cityOptions = [];

    this.cityOptionsCache = {};

    this.cityBranches = [];

    this.cacheCityBranches = {};

    this.suggestCities = function (e) {
        this.setAutoSuggestOn();
        if (this.bank != "") {
            this.cityOptions = [];
            var encodedCity = encodeURI(this.city);
            var encodedBank = encodeURI(this.bank_title);
            if (!(encodedBank in this.cityOptionsCache)) {
                this.ajaxSuggestions(encodedBank, encodedCity);
            } else if (!(encodedCity in this.cityOptionsCache[encodedBank])) {
                this.ajaxSuggestions(encodedBank, encodedCity);
            } else {
                this.cityOptions = this.cityOptionsCache[encodedBank][encodedCity];
            }
        } else {
            this.cityOptions = ["Select bank!"];
        }
    };

    this.setBankTitle = function () {
        this.bank_title = $("select option:selected").text().trim();
        this.city = "";
        this.cityBranches = [];
    };

    this.ajaxSuggestions = function (encodedBank, encodedCity) {
        $http({
            method: 'POST',
            url: '/city-suggestions',
            params: {cityStr: this.city, bank_id: this.bank}
        }).success(function (result) {
            this.cityOptions = result.cities;
            if (!(encodedBank in this.cityOptionsCache)) {
                this.cityOptionsCache[encodedBank] = {};
            }
            if ((encodedBank in this.cityOptionsCache) && !(encodedCity in this.cityOptionsCache[encodedBank])) {
                this.cityOptionsCache[encodedBank][encodedCity] = [];
            }
            this.cityOptionsCache[encodedBank][encodedCity] = result.cities;
            this.updateBranchesCache(result.branches);
        }.bind(this));
    };

    this.suggestionsAreOn = function () {
        return this.cityAutoSuggestOn;
    };

    this.setAutoSuggestOn = function () {
        this.cityAutoSuggestOn = true;
    };

    this.unsetAutoSuggestOn = function () {
        this.cityAutoSuggestOn = false;
    };

    this.selectCity = function (city) {
        if (city.indexOf('Enter') !== 0 && city.indexOf("Select") !== 0) {
            this.city = city;
            console.log(encodeURI(this.bank_title), encodeURI(this.city));
            console.log(this.cacheCityBranches[encodeURI(this.bank_title)]);
            this.cityBranches = this.cacheCityBranches[encodeURI(this.bank_title)][encodeURI(this.city)];
        }
        this.cityOptions = [];
        this.unsetAutoSuggestOn();
    };

    this.updateBranchesCache = function (branches) {
        for (var i in branches) {
            for (var j in branches[i]) {
                if (!(i in this.cacheCityBranches)) {
                    this.cacheCityBranches[i] = {};
                }
                if (!(i in this.cacheCityBranches[i])) {
                    this.cacheCityBranches[i][j] = branches[i][j];
                }
            }
        }
    }
});
