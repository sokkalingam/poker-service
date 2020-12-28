"use strict";
exports.__esModule = true;
exports.EnumUtils = void 0;
var lodash_1 = require("lodash");
var EnumUtils = /** @class */ (function () {
    function EnumUtils() {
    }
    EnumUtils.getKeys = function (enumVar) {
        return Object.keys(enumVar).filter(function (item) { return isNaN(Number(item)); });
    };
    EnumUtils.getNumberValues = function (enumVar) {
        return Object.keys(enumVar).filter(function (item) { return lodash_1.isNumber(Number(item)); });
    };
    return EnumUtils;
}());
exports.EnumUtils = EnumUtils;
