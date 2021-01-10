import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { DeckService } from './deck/DeckService';
import { CardEvaluator } from './cardEvaluation/CardEvaluator';
import { Card } from './model/Card';
import { Suite } from './model/Suite';
import { Face } from './model/Face';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly deckService: DeckService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/test")
  getHello(): Array<Card> {
    const cards = [
      new Card(Suite.Hearts, Face.King),
      new Card(Suite.Hearts, Face.Queen),
      new Card(Suite.Hearts, Face.Jack),
      new Card(Suite.Hearts, Face.Ten),
      new Card(Suite.Hearts, Face.Nine),
      new Card(Suite.Hearts, Face.Eight),
      new Card(Suite.Diamonds, Face.Ace),
    ]
    return CardEvaluator.getStraight(cards)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getDeck(): Array<Card> {
    return this.deckService.get()
  }
}
