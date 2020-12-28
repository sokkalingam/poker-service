import { Test, TestingModule } from '@nestjs/testing';
import { DealerService } from './DealerService';
import { DeckService } from '../deck/DeckService';
import { CardEvaluator } from '../cardEvaluation/CardEvaluator';

describe('DealerService', () => {
  let dealerService: DealerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DealerService, DeckService],
    }).compile();

    dealerService = app.get<DealerService>(DealerService);
  });

  describe('Check Deal', () => {
    it('for N players', () => {
      let numOfPlayers = 5
      let result = dealerService.deal(numOfPlayers)
      expect(result.allPlayerCards.length).toBe(numOfPlayers)
      expect(result.tableCards.length).toBe(5)

      let allCardsSet = new Set(result.tableCards)
      for (let playerCards of result.allPlayerCards) {
        expect(playerCards.length).toBe(2)
        allCardsSet.add(playerCards[0])
        allCardsSet.add(playerCards[1])
      }
      expect(allCardsSet.size).toBe((2 * numOfPlayers) + 5)
    });
  });

  describe('Build Seven Card Deck', () => {
    it ('for N players', () => {
      let numOfPlayers = 15
      let dealtObj = dealerService.deal(numOfPlayers)
      let sevenCardDeckArr = dealerService.buildSevenCardHands(dealtObj.allPlayerCards, dealtObj.tableCards)
      sevenCardDeckArr = CardEvaluator.sortByBestHandDesc(sevenCardDeckArr)
      console.log("TableCards", dealtObj.tableCards)
      for (let deck of sevenCardDeckArr) {
        let bestFive = CardEvaluator.getBestFive(deck);
        console.log(deck, bestFive)
      }
    })
  })

});