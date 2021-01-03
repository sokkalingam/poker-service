import { Card } from './Card';
import { PlayerStatus } from './PlayerStatus';
import { PlayerActionStatus } from './PlayerActionStatus';

export class Player {
  id: string
  name: string
  cards: Array<Card>
  cashInHand: number
  netWorth: number
  isSmallBlind: boolean
  isBigBlind: boolean
  status: PlayerStatus
  lastAction: PlayerActionStatus

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.status = PlayerStatus.Active
  }
}