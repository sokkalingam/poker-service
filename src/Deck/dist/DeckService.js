"use strict";
exports.__esModule = true;
exports.DeckService = void 0;
var Card_1 = require("../model/Card");
var Suite_1 = require("../model/Suite");
var Face_1 = require("../model/Face");
var EnumUtils_1 = require("../Utils/EnumUtils");
var DeckService = /** @class */ (function () {
    function DeckService() {
        this.deck = new Array();
        this.build();
        this.deal();
    }
    DeckService.prototype.build = function () {
        for (var _i = 0, _a = EnumUtils_1.EnumUtils.getKeys(Suite_1.Suite); _i < _a.length; _i++) {
            var suite = _a[_i];
            for (var _b = 0, _c = EnumUtils_1.EnumUtils.getKeys(Face_1.Face); _b < _c.length; _b++) {
                var face = _c[_b];
                if (face !== Face_1.Face.Ace_Max) {
                    this.deck.push(new Card_1.Card(suite, face));
                }
            }
        }
    };
    DeckService.prototype.deal = function () {
        return this.deck;
    };
    return DeckService;
}());
exports.DeckService = DeckService;
