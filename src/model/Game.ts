import { Player } from './Player';
import { Card } from './Card';
import { Pot } from './Pot';
import { RoundStatus } from './RoundStatus';

export class Game {
  id: string
  roundStatus: RoundStatus
  smallBlind: Player
  bigBlind: Player
  pot: Array<Pot>
  gameCards: Array<Card>
  players: Array<Player> = []

  isSmallBlind(player: Player): boolean {
    return this.smallBlind === player
  }

  isBigBlind(player: Player): boolean {
    return this.bigBlind === player
  }

  isBlind(player: Player): boolean {
    return this.isSmallBlind(player) || this.isBigBlind(player)
  }


}