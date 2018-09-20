import { Component, OnInit } from '@angular/core';
import { ExpansionMap, Expansion } from '../models/expansion';
import { forkJoin } from 'rxjs';
import { DominionDataService } from '../services/dominion-data.service';
import { ActiveModal } from '@healthcatalyst/cashmere';
import { SelectedExpansionsService } from '../services/selected-expansions.service';

@Component({
    selector: 'app-expansion-selection',
    templateUrl: 'expansion-selection.component.html'
})

export class ExpansionSelectionComponent implements OnInit {
    expansions: ExpansionMap;
    expansionList: Array<Expansion & { key: string; selected?: boolean; }>;
    get selectedExpansions() {
        return this.expansionList
            .filter(e => e.selected)
            .map(e => e.key);
    }

    constructor(private selectedExpansionsService: SelectedExpansionsService,
                private dominionDataService: DominionDataService,
                private activeModal: ActiveModal) { }

    ngOnInit() {
        forkJoin(
            this.dominionDataService.getExpansions(),
            this.selectedExpansionsService.getSelectedExpansions()
        )
        .subscribe(([expansions, selectedExpansions]) => {
            selectedExpansions = selectedExpansions || Object.keys(expansions);
            this.expansionList = Object.keys(expansions)
                .map(k => Object.assign(
                    { key: k },
                    { selected: selectedExpansions.includes(k) },
                    expansions[k]));
            this.expansions = expansions;
        });
    }

    selectAllExpansions() {
        this.expansionList.forEach(e => e.selected = true);
    }

    selectNoneExpansions() {
        this.expansionList.forEach(e => e.selected = false);
    }

    save() {
        this.selectedExpansionsService.setSelectedExpansions(this.selectedExpansions)
            .subscribe(selectedExpansions => this.activeModal.close(selectedExpansions));
    }
}
