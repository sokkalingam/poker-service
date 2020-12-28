import _ from 'lodash';
import { Card } from '../model/Card';
import { Face } from '../model/Face';
import { PokerHandScore } from '../model/PokerHandScore';
import { Collection } from '@nestjs/cli/lib/schematics';

type handCondition = ((card1:Card, card2:Card) => boolean)
type cardArrPair = { arr1: Array<Card>, arr2: Array<Card> }
type bestFiveResult = { bestFiveCards: Array<Card>, score: number, hand: number }

export class CardEvaluator {

    static NUM_OF_CARDS_IN_HAND = 5

    static straightConditionFilter = ((cardOne: Card, cardTwo: Card) => cardOne.face - cardTwo.face === 1)
    static flushConditionFilter = ((cardOne: Card, cardTwo: Card) => cardOne.suite === cardTwo.suite)
    static straightFlushConditionFilter = ((cardOne: Card, cardTwo: Card) => {
        return cardOne.face - cardTwo.face === 1 && cardOne.suite === cardTwo.suite
    })
    static nOfAKindConditionFilter = ((cardOne: Card, cardTwo: Card) => cardOne.face === cardTwo.face)

    static rankMap = new Map<string, PokerHandScore>([
        ['getStraightFlush', PokerHandScore.StraightFlush],
        ['getFourOfAKind', PokerHandScore.FourOfAKind],
        ['getFullHouse', PokerHandScore.FullHouse],
        ['getFlush', PokerHandScore.Flush],
        ['getStraight', PokerHandScore.Straight],
        ['getThreeOfAKind', PokerHandScore.ThreeOfAKind],
        ['getTwoPair', PokerHandScore.TwoPair],
        ['getPair', PokerHandScore.OnePair],
        ['getHighCard', PokerHandScore.HighCard],
      ])

    public static sortByBestHandDesc(listOfCards: Array<Array<Card>>): Array<Array<Card>> {
        let result = [...listOfCards]
        result.sort((cards1, cards2) => {
            let bestFiveObj1 = this.getBestFive(cards1)
            let bestFiveObj2 = this.getBestFive(cards2)
            let compare = bestFiveObj2.hand - bestFiveObj1.hand
            if (compare != 0) return compare
            return bestFiveObj2.score - bestFiveObj1.score
        })
        return result
    }

    static sortBySuiteAscFaceDesc(cards: Array<Card>): Array<Card> {
        return cards.sort((a, b) => {
            let compareSuite = a.suite.localeCompare(b.suite)
            if (compareSuite != 0) return compareSuite
            return b.face - a.face
        })
    }

    static sortBySuiteAsc(cards: Array<Card>): Array<Card> {
        return cards.sort((a, b) => a.suite.localeCompare(b.suite))
    }

    static sortByFaceDesc(cards: Array<Card>): Array<Card> {
        return cards.sort((a, b) => b.face - a.face)
    }

    static getBestFive(cards: Array<Card>): bestFiveResult {

        for (let [methodName, handRank] of this.rankMap) {
            if (this[methodName]) {
                let result = this[methodName](cards)
                if (result.length > 0) {
                    return {
                        bestFiveCards: result,
                        score: this.getScore(result),
                        hand: handRank
                    }
                }
            }
        }

    }

    static addMaxAces(cards: Array<Card>) {
        for (let card of cards) {
            if (card.isAce()) {
                cards.push(new Card(card.suite, Face.Ace_Max))
            }
        }
    }

    static replaceAceWithAceMax(cards: Array<Card>) {
        for (let card of cards) {
            if (card.isAce()) {
                card.face = Face.Ace_Max
            }
        }
    }

    private static _uniqueFaceCards(cards: Array<Card>): Array<Card> {
        let uniqueFaces = new Set<Face>();
        let uniqueCards = [];
        for (let card of cards) {
            if (!uniqueFaces.has(card.face)) {
                uniqueCards.push(card);
                uniqueFaces.add(card.face);
            }
        }
        return uniqueCards
    }

    public static getStraight(inputCards: Array<Card>): Array<Card> {
        let cards = [...inputCards]
        this.addMaxAces(cards)
        cards = this._uniqueFaceCards(cards)
        this.sortByFaceDesc(cards)
        return this._evalHand(cards, this.straightConditionFilter)
    }

    public static getStraightFlush(inputCards: Array<Card>): Array<Card> {
        let cards = [...inputCards]
        this.addMaxAces(cards)
        this.sortBySuiteAscFaceDesc(cards)
        return this._evalHand(cards, this.straightFlushConditionFilter)
    }

    private static _evalHand(cards: Array<Card>, condition: handCondition, cardWindow: number = this.NUM_OF_CARDS_IN_HAND): Array<Card> {
        let result = new Array<Card>()
        for (let i = 0; i < cards.length; i++) {
            let counter = 1;
            let prevCard = cards[i];
            for (let j = i + 1; j < cards.length; j++) {
                if (condition(prevCard, cards[j])) {
                    counter++;
                    prevCard = cards[j];
                    if (counter === cardWindow) {
                        for (let k = i; k < i + counter; k++) {
                            result.push(cards[k]);
                        }
                        return result;
                    }
                } else {
                    i = j - 1;
                    break;
                }
            }
        }
        return result;
    }

    static getFlush(inputCards: Array<Card>): Array<Card> {
        let cards = [...inputCards]
        this.replaceAceWithAceMax(cards)
        this.sortBySuiteAscFaceDesc(cards)
        return this._evalHand(cards, this.flushConditionFilter)
    }

    static getNOfAKind(inputCards: Array<Card>, n: number): cardArrPair {
        let cards = [...inputCards]
        this.replaceAceWithAceMax(cards)
        this.sortByFaceDesc(cards)
        let nOfAKind = this._evalHand(cards, this.nOfAKindConditionFilter, n)
        return {
            arr1: nOfAKind,
            arr2: _.difference(cards, nOfAKind)
        }
    }

    static getFourOfAKind(cards: Array<Card>): Array<Card> {
        let nOfAKind = this.getNOfAKind(cards, 4)
        return nOfAKind.arr1.length === 0 ? [] : [...nOfAKind.arr1, nOfAKind.arr2[0]]
    }

    static getThreeOfAKind(cards: Array<Card>): Array<Card> {
        let nOfAKind = this.getNOfAKind(cards, 3)
        return nOfAKind.arr1.length === 0 ? [] : [...nOfAKind.arr1, ..._.slice(nOfAKind.arr2, 0, 2)]
    }

    static getPair(cards: Array<Card>): Array<Card> {
        let nOfAKind = this.getNOfAKind(cards, 2)
        return nOfAKind.arr1.length === 0 ? [] : [...nOfAKind.arr1, ..._.slice(nOfAKind.arr2, 0, 3)]
    }

    static getFullHouse(cards: Array<Card>): Array<Card> {
        let threeOfAKindObj = this.getNOfAKind(cards, 3)
        if (threeOfAKindObj.arr1.length === 0) return []
        let twoOfAKindObj = this.getNOfAKind(threeOfAKindObj.arr2, 2)
        return twoOfAKindObj.arr1.length === 0 ? [] : [...threeOfAKindObj.arr1, ...twoOfAKindObj.arr1]
    }

    static getTwoPair(cards: Array<Card>): Array<Card> {
        let firstPairObj = this.getNOfAKind(cards, 2)
        if (firstPairObj.arr1.length === 0) return []
        let secondPairObj = this.getNOfAKind(firstPairObj.arr2, 2)
        return secondPairObj.arr1.length === 0 ? [] : [...firstPairObj.arr1, ...secondPairObj.arr1, secondPairObj.arr2[0]]
    }

    static getHighCard(inputCards: Array<Card>): Array<Card> {
        let cards = [...inputCards]
        this.replaceAceWithAceMax(cards)
        this.sortByFaceDesc(cards)
        return _.slice(cards, 0, 5)
    }

    static getScore(cards: Array<Card>): number {
        let total = 0
        for (let card of cards) {
            total += card.face
        }
        return total
    }


}