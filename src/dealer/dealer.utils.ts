import { Player } from '../model/Player';
import { Card } from '../model/Card';

export class DealerUtils {

  static dealCardsToPlayers(players: Array<Player>, allPlayerCards: Array<Array<Card>>) {
    for (let i in players) {
      players[i].cards = allPlayerCards[i]
    }
  }

}