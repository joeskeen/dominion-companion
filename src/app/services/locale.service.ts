import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class LocaleService {
    public readonly defaultLocale = 'xx';
    public readonly supportedLocales = [
        'cz', 'de', 'en_us', 'fr', 'it', 'nl_du', 'xx'
    ];
    private _currentLocale: string = null;

    constructor(private cookieService: CookieService) { }

    get currentLocale() {
        return this._currentLocale
            || this.cookieService.get('locale')
            || this.defaultLocale;
    }
    set currentLocale(locale: string) {
        if (!this.supportedLocales.includes(locale)) {
            locale = this.defaultLocale;
        }

        this._currentLocale = locale;
        this.cookieService.put('locale', locale);
    }
}
