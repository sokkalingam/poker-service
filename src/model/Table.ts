import { Card } from './Card';
import { Player } from './Player';
import { TableRequest } from './TableRequest';

export class Table extends TableRequest {
  id: number
  // name: string
  // maxPlayersCount: number
  // smallBlindAmount: number
  // bigBlindAmount: number
  // buyInAmount: number
  activePlayersCount: number
  tableCards: Array<Card>
  players: Array<Player>
  pot: number

  constructor(id: number, tableRequest: TableRequest) {
    super();
    this.id = id
    this.name = tableRequest.name
    this.maxPlayersCount = tableRequest.maxPlayersCount
    this.smallBlindAmount = tableRequest.smallBlindAmount
    this.bigBlindAmount = tableRequest.bigBlindAmount
    this.buyInAmount = tableRequest.buyInAmount
    this.activePlayersCount = 0
    this.tableCards = []
    this.players = []
    this.pot = 0
  }
}