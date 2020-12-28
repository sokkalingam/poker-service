import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { DeckService } from '../deck/DeckService';
import { Card } from '../model/Card';

type PlayerCards = [Card, Card]

@Injectable()
export class DealerService {

  constructor(private readonly deckService: DeckService) {}

  deal(numOfPlayers: number) {
    let cards = [...this.deckService.get()]
    let numOfCardsNeeded = (numOfPlayers * 2) + 5
    let selectedCards = DealerService._getRandomCards(cards, numOfCardsNeeded)
    return DealerService._getCardsForPlayerAndTable(selectedCards, numOfPlayers)
  }

  buildSevenCardHands(playerCardsArray: Array<PlayerCards>, tableCards: Array<Card>): Array<Array<Card>> {
    let result = new Array<Array<Card>>()
    for (let playerCards of playerCardsArray) {
      result.push([...playerCards, ...tableCards])
    }
    return result
  }

  private static _getRandomCards(cards: Array<Card>, numOfCardsNeeded: number): Array<Card> {
    let selectedCardsSet = new Set<Card>()
    while (numOfCardsNeeded >= 0) {
      let randomNumber = Math.floor(Math.random() * cards.length)
      let randomCard = cards[randomNumber]
      if (!selectedCardsSet.has(randomCard)) {
        selectedCardsSet.add(randomCard)
        numOfCardsNeeded--
      }
    }
    return [...selectedCardsSet]
  }

  private static _getCardsForPlayerAndTable(cards: Array<Card>, numOfPlayers: number) {
    let allPlayerCards = []
    let i = 0
    while(i < numOfPlayers * 2) {
      allPlayerCards.push([cards[i], cards[i + 1]])
      i += 2
    }
    let tableCards = cards.slice(i + 1)
    return {
      allPlayerCards: allPlayerCards,
      tableCards: tableCards
    }
  }


}