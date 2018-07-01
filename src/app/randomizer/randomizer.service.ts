import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DominionDataService } from '../services/dominion-data.service';
import { Card, CompleteCard } from '../models/card';
import { CompleteExpansion } from '../models/expansion';

@Injectable()
export class RandomizerService {
    private readonly defaultAmount = 10;

    constructor(private dominionDataService: DominionDataService) {
    }

    getRandomCards(expansionKeys: string[], amount = this.defaultAmount): Observable<CompleteCard[]> {
        const targetExpansions$ = expansionKeys
            .map(k => this.dominionDataService.getCompleteExpansion(k));
        return forkJoin(...targetExpansions$)
            .pipe(
                map((expansions: CompleteExpansion[]) => {
                    const allCards = ([].concat.apply([], expansions.map(e => e.cards)) as CompleteCard[])
                        .filter(c => c.randomizer !== false);
                    const uniqueCards = allCards.map(c => allCards.filter(c1 => c1.card_tag === c.card_tag)[0])
                        .filter((c, i) => allCards.indexOf(c) === i);
                    const shuffled = uniqueCards.sort(() => Math.floor((Math.random() * 3) - 1));
                    return shuffled.slice(0, amount)
                        .sort((a, b) => a.name.localeCompare(b.name));
                })
            );
    }
}
