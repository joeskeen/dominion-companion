import { Component, OnInit } from '@angular/core';
import { ExpansionMap, Expansion } from '../models/expansion';
import { forkJoin, from } from 'rxjs';
import { DominionDataService } from '../services/dominion-data.service';
import { ActiveModal } from '@healthcatalyst/cashmere';
import { RandomizerSettingsService } from './randomizer-settings.service';
import { Type } from '../models/type';
import { RandomizerSettings } from './randomizer-settings';

@Component({
  selector: 'app-expansion-selection',
  templateUrl: 'randomizer-settings.component.html',
  styleUrls: ['randomizer-settings.component.scss']
})
export class RandomizerSettingsComponent implements OnInit {
  expansions: ExpansionMap;
  expansionList: Array<Expansion & { key: string; selected?: boolean }>;
  cardTypes: Array<Type & { key: string; selected?: boolean }>;

  get selectedExpansions() {
    return this.expansionList.filter(e => e.selected).map(e => e.key);
  }

  constructor(
    private selectedExpansionsService: RandomizerSettingsService,
    private dominionDataService: DominionDataService,
    private activeModal: ActiveModal
  ) {}

  async ngOnInit() {
    const [expansions, cardTypes, settings] = await forkJoin([
      this.dominionDataService.getExpansions(),
      this.dominionDataService.getCardTypes(),
      from(this.selectedExpansionsService.getRandomizerSettings())
    ]).toPromise();
    this.expansionList = Object.keys(expansions)
      .filter(k => !expansions[k].no_randomizer)
      .map(k =>
        Object.assign(
          { key: k },
          { selected: settings.includedExpansionKeys.includes(k) },
          expansions[k]
        )
      );
    this.expansions = expansions;
    this.cardTypes = cardTypes.map(t => {
      const type = t.card_type.join(' ');
      let selected = settings.cardTypes[type];
      if (selected === undefined) {
        selected = null;
      }
      return Object.assign({ key: type, selected }, t);
    });
  }

  selectAllExpansions() {
    this.expansionList.forEach(e => (e.selected = true));
  }

  selectNoneExpansions() {
    this.expansionList.forEach(e => (e.selected = false));
  }

  async save() {
    const settings: RandomizerSettings = {
      includedExpansionKeys: this.selectedExpansions,
      cardTypes: this.cardTypes.reduce((prev, curr) => {
        if (curr.selected === true || curr.selected === false) {
          prev[curr.card_type.join(' ')] = curr.selected;
        }
        return prev;
      }, {}),
      features: {}
    };
    await this.selectedExpansionsService.setRandomizerSettings(settings);
    this.activeModal.close(settings);
  }
}
