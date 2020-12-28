import { CardEvaluator } from './CardEvaluator';
import { Card } from '../model/Card';
import { Suite } from '../model/Suite';
import { Face } from '../model/Face';
import { PokerHandScore } from '../model/PokerHandScore';

describe('CardEvaluator', () => {

  describe('Sort by', () => {

    it('Suite ascending', () => {
      const cards = [
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Spades, Face.Ten),
        new Card(Suite.Hearts, Face.Nine),
      ]
      expect(CardEvaluator.sortBySuiteAsc(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Hearts, Face.Nine),
        new Card(Suite.Spades, Face.Ten)
      ]);
    });

    it('Suite ascending and face descending', () => {
      const cards = [
        new Card(Suite.Spades, Face.Queen),
        new Card(Suite.Spades, Face.Two),
        new Card(Suite.Hearts, Face.Five),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Clubs, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Hearts, Face.Six),
      ]
      expect(CardEvaluator.sortBySuiteAscFaceDesc(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.Ace_Max),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Hearts, Face.Six),
        new Card(Suite.Hearts, Face.Five),
        new Card(Suite.Spades, Face.Queen),
        new Card(Suite.Spades, Face.Two),
      ]);
    });

  });

  describe('Add Max Aces', () => {
    it ('if Ace is present', () => {
      let cards = [
        new Card(Suite.Hearts, Face.Ace),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Clubs, Face.Queen)
      ];
      CardEvaluator.addMaxAces(cards)
      expect(cards).toStrictEqual([
        new Card(Suite.Hearts, Face.Ace),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Hearts, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.Ace_Max),
      ]);
    });

    it ('does not apply if Ace is not present', () => {
      let cards = [
        new Card(Suite.Hearts, Face.Ten),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Clubs, Face.Queen)
      ];
      CardEvaluator.addMaxAces(cards)
      expect(cards).toStrictEqual(cards);
    });
  });

  describe('Check Get straight', () => {

    it ('for cards with Straight without Ace', () => {
      let cards = [
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Clubs, Face.Ten),
        new Card(Suite.Hearts, Face.Nine),
        new Card(Suite.Clubs, Face.Eight),
        new Card(Suite.Spades, Face.Ace),
      ]
      expect(CardEvaluator.getStraight(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Clubs, Face.Ten),
        new Card(Suite.Hearts, Face.Nine),
        new Card(Suite.Clubs, Face.Eight),
      ])
    })

    it ('for cards with Straight with duplicates', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.Jack),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Hearts, Face.Ten),
        new Card(Suite.Clubs, Face.Nine),
        new Card(Suite.Clubs, Face.Ace),
      ]
      expect(CardEvaluator.getStraight(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.Ace_Max),
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.Jack),
        new Card(Suite.Hearts, Face.Ten),
      ])
    })

    it ('for cards with no straight', () => {
      let cards = [
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Clubs, Face.Jack),
        new Card(Suite.Clubs, Face.Nine),
        new Card(Suite.Clubs, Face.Eight),
        new Card(Suite.Clubs, Face.Ace),
      ]
      expect(CardEvaluator.getStraight(cards)).toStrictEqual([])
    })

  });

  describe('Check getStraightFlush', () => {
    it ('for cards with straight flush', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Diamonds, Face.Ten),
        new Card(Suite.Diamonds, Face.Nine),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Diamonds, Face.Ace),
      ]
      expect(CardEvaluator.getStraightFlush(cards)).toStrictEqual([
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Diamonds, Face.Ten),
        new Card(Suite.Diamonds, Face.Nine),
        new Card(Suite.Diamonds, Face.Eight),
      ])
    })
  })

  describe('Check getFlush', () => {
    it ('for cards with flush', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Diamonds, Face.Five),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.Nine),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Diamonds, Face.King),
      ]
      expect(CardEvaluator.getFlush(cards)).toStrictEqual([
        new Card(Suite.Diamonds, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Nine),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Diamonds, Face.Five),
      ])
    })
  })

  describe("Check for full house", () => {
    it ("for two three of a kind", () => {
      let cards = [
        new Card(Suite.Clubs, Face.Ace),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Hearts, Face.Ace),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Hearts, Face.Queen),
        new Card(Suite.Spades, Face.King),
      ]
      let result = CardEvaluator.getBestFive(cards)
      expect(result.bestFiveCards).toStrictEqual([
        new Card(Suite.Clubs, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.Ace_Max),
        new Card(Suite.Hearts, Face.Ace_Max),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Diamonds, Face.Queen),
      ])
    })
  })

  describe("Check for Two Pair", () => {
    it ("for cards with 3 two pairs", () => {
      let cards = [
        new Card(Suite.Clubs, Face.Ace),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.King),
        new Card(Suite.Clubs, Face.Queen),
        new Card(Suite.Hearts, Face.Nine),
      ]
      let result = CardEvaluator.getBestFive(cards)
      console.log(result)
      expect(result.bestFiveCards).toStrictEqual([
        new Card(Suite.Clubs, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.Ace_Max),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
      ])
    })
  })

  describe('Check N of a kind', () => {

    it ('4 of a kind', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.King),
      ]
      expect(CardEvaluator.getFourOfAKind(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Spades, Face.King),
        new Card(Suite.Spades, Face.Ace_Max),
      ])
    })

    it ('3 of a kind', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.Queen),
      ]
      expect(CardEvaluator.getThreeOfAKind(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Spades, Face.Ace_Max),
        new Card(Suite.Spades, Face.Queen),
      ])
    })

    it ('2 of a kind', () => {
      let cards = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Clubs, Face.Two),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.Queen),
      ]
      expect(CardEvaluator.getPair(cards)).toStrictEqual([
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace_Max),
        new Card(Suite.Spades, Face.Queen),
        new Card(Suite.Diamonds, Face.Eight),
      ])
    })
  })

  /**
   * Test Full house
   * - Call with 2 three of a kind (6 cards) + 1 random
   */

  describe("Check getBestFive", () => {

    it ("for Royal Flush with duplicates", () => {
      let cards = [
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Clubs, Face.Jack),
        new Card(Suite.Diamonds, Face.Ten)
      ]
      let result = CardEvaluator.getBestFive(cards)
      expect(result.bestFiveCards).toStrictEqual([
        new Card(Suite.Diamonds, Face.Ace_Max),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Diamonds, Face.Ten),
      ])
      expect(result.score).toBe(60)
      expect(result.hand).toBe(PokerHandScore.StraightFlush)
    })

    it ("for Straight Flush with duplicates", () => {
      let cards = [
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Clubs, Face.Two),
        new Card(Suite.Diamonds, Face.Three),
        new Card(Suite.Diamonds, Face.Four),
        new Card(Suite.Spades, Face.Four),
        new Card(Suite.Diamonds, Face.Five)
      ]
      let result = CardEvaluator.getBestFive(cards)
      expect(result.bestFiveCards).toStrictEqual([
        new Card(Suite.Diamonds, Face.Five),
        new Card(Suite.Diamonds, Face.Four),
        new Card(Suite.Diamonds, Face.Three),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Diamonds, Face.Ace)
      ])
      expect(result.score).toBe(15)
      expect(result.hand).toBe(PokerHandScore.StraightFlush)
    })


  })

  describe("Check sortByBestHandDesc", () => {
    it ("for different hands", () => {
      let royalFlush = [
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.Queen),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Clubs, Face.Jack),
        new Card(Suite.Diamonds, Face.Ten)
      ]
      let straightFlush = [
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Clubs, Face.Two),
        new Card(Suite.Diamonds, Face.Three),
        new Card(Suite.Diamonds, Face.Four),
        new Card(Suite.Spades, Face.Four),
        new Card(Suite.Diamonds, Face.Five)
      ]
      let straight = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Queen),
        new Card(Suite.Spades, Face.Jack),
        new Card(Suite.Diamonds, Face.Jack),
        new Card(Suite.Hearts, Face.Ten),
        new Card(Suite.Clubs, Face.Nine),
        new Card(Suite.Clubs, Face.Ace),
      ]
      let flush = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Diamonds, Face.Five),
        new Card(Suite.Diamonds, Face.Ace),
        new Card(Suite.Diamonds, Face.Nine),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Diamonds, Face.King),
      ]
      let fourOfAKind = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.King),
      ]
      let threeOfAKind = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.King),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.Queen),
      ]
      let twoOfAKind = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.King),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.Queen),
      ];
      let highCard = [
        new Card(Suite.Clubs, Face.King),
        new Card(Suite.Diamonds, Face.Two),
        new Card(Suite.Hearts, Face.Jack),
        new Card(Suite.Spades, Face.Ace),
        new Card(Suite.Diamonds, Face.Seven),
        new Card(Suite.Diamonds, Face.Eight),
        new Card(Suite.Spades, Face.Queen),
      ];
      expect(CardEvaluator.sortByBestHandDesc([threeOfAKind, highCard, twoOfAKind, fourOfAKind, flush, straight, straightFlush, royalFlush])).toStrictEqual(
        [royalFlush, straightFlush, fourOfAKind, flush, straight, threeOfAKind, twoOfAKind, highCard])
    })
  })

});