import { Component, OnInit } from '@angular/core';
import { DominionDataService } from '../services/dominion-data.service';
import { RandomizerService } from './randomizer.service';
import { Card } from '../models/card';
import { ExpansionMap } from '../models/expansion';

@Component({
    selector: 'app-randomizer',
    templateUrl: 'randomizer.component.html',
    styleUrls: ['randomizer.component.scss']
})
export class RandomizerComponent implements OnInit {
    cards: Card[];
    expansions: ExpansionMap;
    get expansionList() {
        return Object.keys(this.expansions)
            .map(k => Object.assign({ key: k }, this.expansions[k]));
    }
    get selectedExpansions() { return Object.keys(this.expansions); }
    readonly expansionSelections: { [expansionKey: string]: boolean; } = {};

    constructor(private dominionDataService: DominionDataService,
                private randomizerService: RandomizerService) {
        (window as any).component = this;
    }

    ngOnInit() {
        this.dominionDataService.getExpansions()
            .subscribe(expansions => {
                Object.keys(expansions)
                    .forEach(expansionKey => this.expansionSelections[expansionKey] = true);
                this.expansions = expansions;
                this.randomize();
            });
    }

    randomize() {
        this.randomizerService.getRandomCards(this.selectedExpansions)
            .subscribe(cards => this.cards = cards);
    }
}
