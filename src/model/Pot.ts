import { Player } from './Player';

export class Pot {

  amount: number
  contributors: Set<Player>

  constructor() {
    this.amount = 0
    this.contributors = new Set<Player>()
  }

}