import { Component, OnInit } from '@angular/core';
import { DominionDataService } from '../services/dominion-data.service';
import { RandomizerService } from './randomizer.service';
import { Card } from '../models/card';
import { ExpansionMap, Expansion } from '../models/expansion';
import { Type, LocaleType } from '../models/type';
import { forkJoin } from 'rxjs';
import { SelectedExpansionsService } from '../services/selected-expansions.service';
import { ModalService } from '@healthcatalyst/cashmere';
import { RandomizerSettingsComponent } from '../randomizer-settings/randomizer-settings.component';

@Component({
    selector: 'app-randomizer',
    templateUrl: 'randomizer.component.html',
    styleUrls: ['randomizer.component.scss']
})
export class RandomizerComponent implements OnInit {
    cards: Card[];
    cardTypes: LocaleType[];
    expansions: ExpansionMap;
    expansionList: Array<Expansion & { key: string; selected?: boolean; }> = [];
    get selectedExpansions() {
        return this.expansionList
            .filter(e => e.selected)
            .map(e => e.key);
    }

    constructor(private dominionDataService: DominionDataService,
                private randomizerService: RandomizerService,
                private selectedExpansionsService: SelectedExpansionsService,
                private modalService: ModalService) {
        (window as any).component = this;
    }

    getExpansion(card: Card): Expansion {
        const setTag = card.cardset_tags
            .filter(s => this.selectedExpansions.includes(s))
            [0];
        return this.expansions[setTag];
    }

    getType(card: Card): Type {
        const types = card.types.join(', ');
        return this.cardTypes.filter(ct => ct.card_type.join(', ') === types)[0];
    }

    ngOnInit() {
        forkJoin(
            this.dominionDataService.getExpansions(),
            this.dominionDataService.getCardTypes(),
            this.selectedExpansionsService.getSelectedExpansions()
        )
        .subscribe(([expansions, cardTypes, selectedExpansions]) => {
            this.cardTypes = cardTypes;
            this.expansionList = Object.keys(expansions)
                .map(k => Object.assign(
                    { key: k },
                    { selected: selectedExpansions.includes(k) },
                    expansions[k]));
            this.expansions = expansions;
            this.selectedExpansionsService.selectedExpansionsChanged
                .subscribe(newSelectedExpansions => {
                    this.expansionList.forEach(expansion =>
                        expansion.selected = newSelectedExpansions.includes(expansion.key));
                    this.randomize();
                });
            this.randomize();
        });
    }

    randomize() {
        this.randomizerService.getRandomCards(this.selectedExpansions)
            .subscribe(cards => this.cards = cards);
    }

    changeSettings() {
        this.modalService.open(RandomizerSettingsComponent, { size: 'md' });
    }
}
