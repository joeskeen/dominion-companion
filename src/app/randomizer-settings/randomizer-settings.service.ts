import { Injectable } from '@angular/core';
import { PreferencesService } from '../services/preferences.service';
import { Subject } from 'rxjs';
import { RandomizerSettings } from './randomizer-settings';

@Injectable()
export class RandomizerSettingsService {
  private readonly preferenceKey = 'randomizerSettings';
  private defaultSelectedExpansions: string[] = ['dominion2ndEdition'];

  readonly randomizerSettingsChanged = new Subject<RandomizerSettings>();

  constructor(private preferences: PreferencesService) {}

  async getRandomizerSettings(): Promise<RandomizerSettings> {
    const settings = await this.preferences
      .getPreference<RandomizerSettings>(this.preferenceKey)
      .toPromise();
    return (
      settings || {
        includedExpansionKeys: this.defaultSelectedExpansions,
        cardTypes: {},
        features: {}
      }
    );
  }

  async setRandomizerSettings(settings: RandomizerSettings) {
    await this.preferences
      .setPreference(this.preferenceKey, settings)
      .toPromise();
    this.randomizerSettingsChanged.next(settings);
  }
}
