"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CardEvaluator = void 0;
var Card_1 = require("../model/Card");
var Face_1 = require("../model/Face");
var CardEvaluator = /** @class */ (function () {
    function CardEvaluator() {
    }
    CardEvaluator.sortBySuiteAscFaceDesc = function (cards) {
        return cards.sort(function (a, b) {
            var compareSuite = a.suite.localeCompare(b.suite);
            if (compareSuite != 0)
                return compareSuite;
            return b.face - a.face;
        });
    };
    CardEvaluator.sortBySuiteAsc = function (cards) {
        return cards.sort(function (a, b) { return a.suite.localeCompare(b.suite); });
    };
    CardEvaluator.sortByFaceDesc = function (cards) {
        return cards.sort(function (a, b) { return b.face - a.face; });
    };
    CardEvaluator.getBestFive = function (cards) {
        return Array.from(cards);
    };
    CardEvaluator.convertToNumbers = function (cards) {
        var arr = [];
        for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card = cards_1[_i];
            arr.push(card.face);
        }
        return arr;
    };
    CardEvaluator.addMaxAces = function (cards) {
        for (var _i = 0, cards_2 = cards; _i < cards_2.length; _i++) {
            var card = cards_2[_i];
            if (card.isAce()) {
                cards.push(new Card_1.Card(card.suite, Face_1.Face.Ace_Max));
            }
        }
    };
    CardEvaluator.getStraight = function (inputCards) {
        var cards = __spreadArrays(inputCards);
        this.addMaxAces(cards);
        this.sortBySuiteAscFaceDesc(cards);
        var result = this._getStraight(cards);
        if (result)
            return result;
        this.sortByFaceDesc(cards);
        return this._getStraight(cards);
    };
    CardEvaluator._getStraight = function (cards) {
        var result = new Array();
        for (var i = 0; i < cards.length; i++) {
            var counter = 1;
            var prev = cards[i].face;
            for (var j = i + 1; j < cards.length; j++) {
                if (prev - cards[j].face == 1) {
                    counter++;
                    prev = cards[j].face;
                    if (counter === this.NUM_OF_CARDS_IN_HAND) {
                        for (var k = i; k < i + counter; k++) {
                            result.push(cards[k]);
                        }
                        return result;
                    }
                }
            }
        }
        return result;
    };
    CardEvaluator.NUM_OF_CARDS_IN_HAND = 5;
    return CardEvaluator;
}());
exports.CardEvaluator = CardEvaluator;
