import { Card } from '../model/Card'
import { Suite } from '../model/Suite'
import { Face } from '../model/Face'
import { EnumUtils } from '../utils/EnumUtils'
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckService {

    deck: Set<Card>

    constructor() {
        this.deck = new Set<Card>()
        this.build()
    }

    build() {
        for (let suite of EnumUtils.getKeys(Suite)) {
            for (let face of EnumUtils.getNumberValues(Face)) {
                if (face !== Face.Ace_Max) {
                    this.deck.add(new Card(suite, face))
                }
            }
        }
    }
    
    get() {
        return this.deck;
    }

}