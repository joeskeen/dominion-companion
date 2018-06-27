import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading = true;
  cards: any[];
  sets: any;
  types: any;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    const cards$ = this.httpClient.get<any[]>('assets/data/cards_db.json');
    const sets$ = this.httpClient.get('assets/data/sets_db.json');
    const types$ = this.httpClient.get('assets/data/types_db.json');
    const cardText$ = this.httpClient.get('assets/data/en_us/cards_en_us.json');
    const setText$ = this.httpClient.get('assets/data/en_us/sets_en_us.json');
    const typeText$ = this.httpClient.get('assets/data/en_us/types_en_us.json');
    const bonusText$ = this.httpClient.get('assets/data/en_us/bonuses_en_us.json');
    forkJoin(cards$, sets$, types$, cardText$, setText$, typeText$, bonusText$)
      .subscribe(([cards, sets, types, cardTexts, setTexts, typeTexts, bonusTexts]) => {
        this.cards = cards.map(c => {
          const text = cardTexts[c.card_tag];
          return Object.assign({}, c, text);
        });
        this.sets = sets;
        this.types = types;
        this.loading = false;
      });
  }

  setFor(card: any) {
    const setTag = card.cardset_tags[0];
    const set = Object.assign({}, this.sets[setTag]);
    set.image = `assets/images/${set.image}`;
    return set;
  }
}
