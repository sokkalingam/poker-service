import { Table } from '../model/Table';
import { Player } from '../model/Player';
import { Pot } from '../model/Pot';
import { RoundStatus } from '../model/RoundStatus';
import { Game } from '../model/Game';
import { GameService } from '../game/game.service';

export class AccountUtils {

  static setupInitialBuyIn(table: Table) {
    let players = table.players
    let initialBuyIn = table.buyInAmount
    for (let player of players) {
      player.cashInHand = initialBuyIn

    }
  }

  static makeBlindsPay(table: Table) {
    let game = table.game
    let pot = new Pot()

    pot.amount += table.smallBlind
    game.smallBlind.cashInHand -= table.smallBlind
    pot.contributors.add(game.smallBlind)

    pot.amount += table.bigBlind
    game.bigBlind.cashInHand -= table.bigBlind
    pot.contributors.add(game.bigBlind)

    game.pot.push(pot)

    game.roundStatus = RoundStatus.BlindsPaid
  }

  static getInputOptions(game: Game, player: Player) {
    // RoundStatus.NotStarted
    // RoundStatus.BlindsPaid
    if (game.roundStatus === RoundStatus.CardsDealt) {
      if (game.isSmallBlind(player)) {
        return {  }
      }
    }
  }
}