import { Injectable } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class SelectedExpansionsService {
    private readonly preferenceKey = 'selectedExpansions';
    private defaultSelectedExpansions: string[] = ['dominion2ndEdition'];

    readonly selectedExpansionsChanged = new Subject<string[]>();

    constructor(private preferences: PreferencesService) { }

    getSelectedExpansions() {
        return this.preferences.getPreference<string[]>(this.preferenceKey)
            .pipe(map(expansions => expansions || this.defaultSelectedExpansions));
    }

    setSelectedExpansions(expansions: string[]) {
        return this.preferences.setPreference(this.preferenceKey, expansions)
            .pipe(tap(() => this.selectedExpansionsChanged.next(expansions)));
    }
}
