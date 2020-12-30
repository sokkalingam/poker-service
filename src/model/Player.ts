import { Card } from './Card';

export class Player {
  id: string
  name: string
  cards: Array<Card>
  cashInHand: number
  netWorth: number
  isSmallBlind: boolean
  isBigBlind: boolean
}