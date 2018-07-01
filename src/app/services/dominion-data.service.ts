import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleService } from './locale.service';
import { Card, LocaleCardTextMap, CardText } from '../models/card';
import { ExpansionMap, LocaleExpansionTextMap, CompleteExpansion } from '../models/expansion';
import { Type, LocaleTypeTextMap } from '../models/type';
import { Expansion } from '../models/expansion';

@Injectable()
export class DominionDataService {
  private _cards: Card[];
  private readonly _cardTexts: { [localeKey: string]: LocaleCardTextMap; } = {};
  private _expansions: ExpansionMap;
  private readonly _setTexts: { [localeKey: string]: LocaleExpansionTextMap; } = {};
  private _types: Type[];
  private readonly _typeTexts: { [localeKey: string]: LocaleTypeTextMap; } = {};
  private readonly imageRoot = 'assets/images/';

  constructor(private httpClient: HttpClient,
              private localeService: LocaleService) {
  }

  initialize(): Observable<{}> {
      // warm up the cache
      return forkJoin(
        this.cards,
        this.expansions,
        this.types,
        this.getCardTexts(),
        this.getExpansionTexts(),
        this.getTypeTexts())
        .pipe(map(() => ({})));
  }

  public getExpansions(): Observable<ExpansionMap> {
      return forkJoin(this.expansions, this.getExpansionTexts()).pipe(
          map(([expansions, expansionTexts]) => Object.keys(expansions)
                .map(k => Object.assign({ key: k }, expansions[k], expansionTexts[k]))
                .reduce((curr, next) => { curr[next.key] = next; return curr; }, {})
            )
      );
  }

  public getCompleteExpansion(expansionKey: string): Observable<CompleteExpansion> {
      const targetExpansion$ = this.expansions.pipe(
        map<ExpansionMap, Expansion>(e => Object.keys(e)
            .map(k => Object.assign({ $key: k }, e[k]))
            .filter(expansion => expansion.$key === expansionKey)
            [0]
        )
      );
      const targetExpansionText$ = this.getExpansionTexts();
      const cards$ = this.cards;
      const cardText$ = this.getCardTexts();
      return forkJoin(targetExpansion$, cards$, targetExpansionText$, cardText$)
        .pipe(
            map(([targetExpansion, cards, targetExpansionText, cardText]) => {
                const expansionCards = cards
                  .filter(c => c.cardset_tags.includes(expansionKey))
                  .map(c => Object.assign({}, c, cardText[c.card_tag]));
                return Object.assign(
                    { cards: expansionCards },
                    targetExpansion,
                    targetExpansionText);
            })
        );
  }

  private get cards(): Observable<Card[]> {
    if (this._cards) {
        return of(this._cards);
    }
    const cards$ = this.httpClient.get<Card[]>(this.getDataUrl('cards'));
    cards$.subscribe(c => this._cards = c);
    return cards$;
  }

  private getCardTexts(): Observable<LocaleCardTextMap> {
    const locale = this.localeService.currentLocale;
    const localeCardTexts = this._cardTexts[locale];
    if (localeCardTexts) {
        return of(localeCardTexts);
    }
    const localeCardTexts$ = this.httpClient.get<LocaleCardTextMap>(this.getTextUrl('cards'));
    localeCardTexts$.subscribe(lct => this._cardTexts[locale] = lct);
    return localeCardTexts$;
  }

  private get expansions(): Observable<ExpansionMap> {
    if (this._expansions) {
        return of(this._expansions);
    }
    const expansions$ = this.httpClient.get<ExpansionMap>(this.getDataUrl('sets'));
    expansions$.subscribe(s => {
        Object.keys(s)
            .filter(setKey => !!s[setKey].image)
            .forEach(setKey => s[setKey].image = this.imageRoot + s[setKey].image);
        this._expansions = s;
    });
    return expansions$;
  }

  private getExpansionTexts(): Observable<LocaleExpansionTextMap> {
    const locale = this.localeService.currentLocale;
    const localeSetTexts = this._setTexts[locale];
    if (localeSetTexts) {
        return of(localeSetTexts);
    }
    const localeSetTexts$ = this.httpClient.get<LocaleExpansionTextMap>(this.getTextUrl('sets'));
    localeSetTexts$.subscribe(lct => this._setTexts[locale] = lct);
    return localeSetTexts$;
  }

  private get types(): Observable<Type[]> {
    if (this._types) {
        return of(this._types);
    }
    const types$ = this.httpClient.get<Type[]>(this.getDataUrl('types'));
    types$.subscribe(t => {
        Object.keys(t)
            .filter(typeKey => !!t[typeKey].image)
            .forEach(typeKey => t[typeKey].image = this.imageRoot + t[typeKey].image);
        this._types = t;
    });
    return types$;
  }

  private getTypeTexts(): Observable<LocaleTypeTextMap> {
    const locale = this.localeService.currentLocale;
    const localeTypeTexts = this._typeTexts[locale];
    if (localeTypeTexts) {
        return of(localeTypeTexts);
    }
    const localeTypeTexts$ = this.httpClient.get<LocaleTypeTextMap>(this.getTextUrl('types'));
    localeTypeTexts$.subscribe(lct => this._typeTexts[locale] = lct);
    return localeTypeTexts$;
  }

  private getDataUrl(dataType: 'cards' | 'sets' | 'types' | 'bonuses') {
    return `assets/data/${dataType}_db.json`;
  }

  private getTextUrl(dataType: 'cards' | 'sets' | 'types' | 'bonuses') {
    const locale = this.localeService.currentLocale;
    return `assets/data/${locale}/${dataType}_${locale}.json`;
  }
}
