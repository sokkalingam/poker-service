"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var CardEvaluator_1 = require("./CardEvaluation/CardEvaluator");
var Card_1 = require("./model/Card");
var Suite_1 = require("./model/Suite");
var Face_1 = require("./model/Face");
var AppController = /** @class */ (function () {
    function AppController(appService, deckService) {
        this.appService = appService;
        this.deckService = deckService;
    }
    AppController.prototype.getHello = function () {
        var cards = new Array();
        cards.push(new Card_1.Card(Suite_1.Suite.Diamonds, Face_1.Face.King));
        cards.push(new Card_1.Card(Suite_1.Suite.Diamonds, Face_1.Face.Queen));
        cards.push(new Card_1.Card(Suite_1.Suite.Diamonds, Face_1.Face.Jack));
        cards.push(new Card_1.Card(Suite_1.Suite.Diamonds, Face_1.Face.Ten));
        // cards.push(new Card(Suite.Diamonds, Face.Nine))
        cards.push(new Card_1.Card(Suite_1.Suite.Spades, Face_1.Face.Ace));
        // cards.push(new Card(Suite.Diamonds, Face.Ace))
        return CardEvaluator_1.CardEvaluator.getStraight(cards);
    };
    AppController.prototype.getDeck = function () {
        return this.deckService.deal();
    };
    __decorate([
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
        common_1.Get()
    ], AppController.prototype, "getHello");
    __decorate([
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
        common_1.Get("/deck")
    ], AppController.prototype, "getDeck");
    AppController = __decorate([
        common_1.Controller()
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
