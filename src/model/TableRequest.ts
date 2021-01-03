import { Player } from './Player';

export class TableRequest {
  name: string
  maxPlayersCount: number
  smallBlind: number
  bigBlind: number
  buyInAmount: number
  reBuyInAmount: number
  hostedBy: Player
}