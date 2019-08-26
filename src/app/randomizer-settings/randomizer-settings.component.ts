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
  features: Array<{ key: string; pattern: RegExp; selected?: boolean }>;
  featureDefinitions = [
    { key: '+ Action', pattern: /\+\d+ Action/ },
    { key: '+ Buy', pattern: /\+\d+ Buy/ },
    { key: '+ Card', pattern: /\+\d+ Card/ },
    { key: '+ Coffer', pattern: /\+\d+ Coffer/ },
    { key: '+ Coin', pattern: /\+\d+ Coin/ },
    { key: 'Affect other players', pattern: /player/ },
    { key: 'Gain', pattern: /gain/ },
    { key: 'Trash', pattern: /trash/ },
    { key: 'Token', pattern: /token/ },
    { key: 'Villager', pattern: /\+\d+ Villager/ },
    { key: 'VP Token', pattern: /<VP> token/ }
  ];

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
    this.features = this.featureDefinitions.map(f => {
      let enabled: boolean = (settings.features[f.key] || ({} as any)).enabled;
      if (enabled === undefined) {
        enabled = null;
      }
      return Object.assign({ selected: enabled }, f);
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
      features: this.features.reduce((prev, curr) => {
        if (curr.selected === true || curr.selected === false) {
          prev[curr.key] = { pattern: curr.pattern, enabled: curr.selected };
        }
        return prev;
      }, {})
    };
    await this.selectedExpansionsService.setRandomizerSettings(settings);
    this.activeModal.close(settings);
  }
}
