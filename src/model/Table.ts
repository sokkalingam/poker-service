import { Card } from './Card';
import { Player } from './Player';
import { TableRequest } from './TableRequest';
import { Game } from './Game';

export class Table extends TableRequest {
  id: string
  activePlayersCount: number
  players: Array<Player>
  createdAt: Date
  game: Game

  constructor(id: string, tableRequest: TableRequest) {
    super();
    this.createdAt = new Date()
    this.id = id
    this.name = tableRequest.name
    this.maxPlayersCount = tableRequest.maxPlayersCount
    this.smallBlind = tableRequest.smallBlind
    this.bigBlind = tableRequest.bigBlind
    this.buyInAmount = tableRequest.buyInAmount
    this.reBuyInAmount = tableRequest.reBuyInAmount
    this.hostedBy = tableRequest.hostedBy
    this.activePlayersCount = 0
    this.players = []
  }
}