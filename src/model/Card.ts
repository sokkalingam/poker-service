import { Suite } from './Suite';
import { Face } from './Face';

export class Card {
    suite: Suite
    face: Face

    constructor(suite: Suite, face: Face) {
        this.suite = suite;
        this.face = face;
    }

    equals(otherCard : Card): boolean {
        return this.face === otherCard.face && this.suite === otherCard.suite
    }

    isAce(): boolean {
        return this.face === Face.Ace
    }

    static equals(cardOne: Card, cardTwo: Card): boolean {
        return cardOne.face === cardTwo.face && cardOne.suite === cardTwo.suite
    }

    public toString(): string {
        return `Suite: ${this.suite}, Face: ${this.face}`
    }

}