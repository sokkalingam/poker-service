import { Card } from '../model/Card'
import { Suite } from '../model/Suite'
import { Face } from '../model/Face'
import { EnumUtils } from '../Utils/EnumUtils'

export class DeckService {

    deck: Array<Card>

    constructor() {
        this.deck = []
        this.build()
    }

    build() {
        for (let suite of EnumUtils.getKeys(Suite)) {
            for (let face of EnumUtils.getNumberValues(Face)) {
                if (face !== Face.Ace_Max) {
                    this.deck.push(new Card(suite, face))
                }
            }
        }
    }
    
    deal() {
        return this.deck;
    }

}