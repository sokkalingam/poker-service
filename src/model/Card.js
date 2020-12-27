"use strict";
exports.__esModule = true;
exports.Card = void 0;
var Face_1 = require("./Face");
var Card = /** @class */ (function () {
    function Card(suite, face) {
        this.suite = suite;
        this.face = face;
    }
    Card.prototype.equals = function (otherCard) {
        return this.face === otherCard.face && this.suite === otherCard.suite;
    };
    Card.prototype.isAce = function () {
        return this.face === Face_1.Face.Ace;
    };
    Card.equals = function (cardOne, cardTwo) {
        return cardOne.face === cardTwo.face && cardOne.suite === cardTwo.suite;
    };
    return Card;
}());
exports.Card = Card;
