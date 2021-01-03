import { Card } from './Card';
import { Player } from './Player';
import { TableRequest } from './TableRequest';

export class Table extends TableRequest {
  id: string
  activePlayersCount: number
  tableCards: Array<Card>
  players: Array<Player>
  pot: number
  createdAt: Date

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
    this.tableCards = []
    this.players = []
    this.pot = 0
  }
}