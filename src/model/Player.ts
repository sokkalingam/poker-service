import { Card } from './Card';
import { PlayerStatus } from './PlayerStatus';
import { PlayerActionStatus } from './PlayerActionStatus';
import { Socket } from 'socket.io';
import _ from 'lodash';

export class Player {
  id: string
  name: string
  cards: Array<Card>
  cashInHand: number
  cashBorrowed: number
  // isSmallBlind: boolean
  // isBigBlind: boolean
  status: PlayerStatus
  lastAction: PlayerActionStatus
  private netWorth: number

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.status = PlayerStatus.Active
  }

  getNetWorth(): number {
    return this.cashInHand - this.cashBorrowed
  }
}