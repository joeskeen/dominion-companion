import { Component, OnInit } from '@angular/core';
import { DominionDataService } from '../services/dominion-data.service';
import { RandomizerService } from './randomizer.service';
import { Card } from '../models/card';
import { ExpansionMap, Expansion } from '../models/expansion';
import { Type, LocaleType } from '../models/type';
import { forkJoin, from } from 'rxjs';
import { RandomizerSettingsService } from '../randomizer-settings/randomizer-settings.service';
import { ModalService } from '@healthcatalyst/cashmere';
import { RandomizerSettingsComponent } from '../randomizer-settings/randomizer-settings.component';
import { RandomizerSettings } from '../randomizer-settings/randomizer-settings';

@Component({
  selector: 'app-randomizer',
  templateUrl: 'randomizer.component.html',
  styleUrls: ['randomizer.component.scss'],
})
export class RandomizerComponent implements OnInit {
  cards: Card[];
  cardTypes: LocaleType[];
  expansions: ExpansionMap;
  expansionList: Array<Expansion & { key: string; selected?: boolean }> = [];
  settings: RandomizerSettings;
  get selectedExpansions() {
    return this.expansionList.filter((e) => e.selected).map((e) => e.key);
  }

  constructor(
    private dominionDataService: DominionDataService,
    private randomizerService: RandomizerService,
    private settingsService: RandomizerSettingsService,
    private modalService: ModalService
  ) {}

  getExpansion(card: Card): Expansion {
    const setTag = card.cardset_tags.filter((s) =>
      this.selectedExpansions.includes(s)
    )[0];
    return this.expansions[setTag];
  }

  getType(card: Card): Type {
    const types = card.types.join(', ');
    return this.cardTypes.filter((ct) => ct.card_type.join(', ') === types)[0];
  }

  async ngOnInit() {
    const [expansions, cardTypes, settings] = await forkJoin([
      this.dominionDataService.getExpansions(),
      this.dominionDataService.getCardTypes(),
      from(this.settingsService.getRandomizerSettings()),
    ]).toPromise();
    this.settings = settings;
    this.cardTypes = cardTypes;
    this.expansionList = Object.keys(expansions).map((k) =>
      Object.assign(
        { key: k },
        { selected: settings.includedExpansionKeys.includes(k) },
        expansions[k]
      )
    );
    this.expansions = expansions;
    this.settingsService.randomizerSettingsChanged.subscribe((newSettings) => {
      this.settings = newSettings;
      this.expansionList.forEach(
        (expansion) =>
          (expansion.selected = newSettings.includedExpansionKeys.includes(
            expansion.key
          ))
      );
      this.randomize();
    });
    this.randomize();
  }

  async randomize() {
    this.cards = await this.randomizerService.getRandomCards(this.settings);
  }

  changeSettings() {
    this.modalService.open(RandomizerSettingsComponent, { size: 'lg' });
  }
}
