import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PreferencesService {
    constructor(private localStorage: LocalStorage) {
    }

    getPreference<T>(key: string): Observable<T> {
        return this.localStorage.getItem<T>(key);
    }

    setPreference<T>(key: string, value: T): Observable<T> {
        return this.localStorage.setItem(key, value)
            .pipe(
                map(() => value)
            );
    }

    resetPreference(key: string): Observable<{}> {
        return this.localStorage.removeItem(key);
    }
}
