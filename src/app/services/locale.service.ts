import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreferencesService } from './preferences.service';

@Injectable()
export class LocaleService {
    public readonly defaultLocale = 'xx';
    public readonly supportedLocales = [
        'cz', 'de', 'en_us', 'fr', 'it', 'nl_du', 'xx'
    ];
    private _currentLocale: string = null;

    constructor(private preferencesService: PreferencesService) { }

    getCurrentLocale(): Observable<string> {
        if (this._currentLocale) {
            return of(this._currentLocale);
        }

        return this.preferencesService.getPreference<string>('locale')
            .pipe(
                map(l => l || this.defaultLocale)
            );
    }
    setLocale(locale: string) {
        if (!this.supportedLocales.includes(locale)) {
            locale = this.defaultLocale;
        }

        this._currentLocale = locale;
        this.preferencesService.setPreference('locale', locale);
    }
}
