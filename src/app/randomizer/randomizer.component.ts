import { Component, OnInit } from '@angular/core';
import { DominionDataService } from '../services/dominion-data.service';
import { RandomizerService } from './randomizer.service';
import { Card } from '../models/card';
import { ExpansionMap, Expansion } from '../models/expansion';

@Component({
    selector: 'app-randomizer',
    templateUrl: 'randomizer.component.html',
    styleUrls: ['randomizer.component.scss']
})
export class RandomizerComponent implements OnInit {
    cards: Card[];
    expansions: ExpansionMap;
    expansionList: Array<Expansion & { key: string; selected?: boolean; }>;
    get selectedExpansions() {
        return this.expansionList
            .filter(e => e.selected)
            .map(e => e.key);
    }

    constructor(private dominionDataService: DominionDataService,
                private randomizerService: RandomizerService) {
        (window as any).component = this;
    }

    ngOnInit() {
        this.dominionDataService.getExpansions()
            .subscribe(expansions => {
                this.expansionList = Object.keys(expansions)
                    .map(k => Object.assign({ key: k }, { selected: true }, expansions[k]));
                this.expansions = expansions;
                this.randomize();
            });
    }

    randomize() {
        this.randomizerService.getRandomCards(this.selectedExpansions)
            .subscribe(cards => this.cards = cards);
    }

    selectAllExpansions() {
        this.expansionList.forEach(e => e.selected = true);
    }

    selectNoneExpansions() {
        this.expansionList.forEach(e => e.selected = false);
    }
}
