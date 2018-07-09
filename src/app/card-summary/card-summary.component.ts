import { Component, Input } from '@angular/core';
import { Card } from '../models/card';
import { LocaleType } from '../models/type';
import { Expansion } from '../models/expansion';

@Component({
    selector: 'app-card-summary',
    templateUrl: 'card-summary.component.html',
    styleUrls: [ 'card-summary.component.scss' ]
})
export class CardSummaryComponent {
    @Input() card: Card;
    @Input() expansion: Expansion;
    @Input() type: LocaleType;
}
