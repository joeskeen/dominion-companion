import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DominionDataService } from '../services/dominion-data.service';
import { CompleteCard } from '../models/card';
import { CompleteExpansion } from '../models/expansion';
import { RandomizerSettings } from '../randomizer-settings/randomizer-settings';

@Injectable()
export class RandomizerService {
  private readonly defaultCount = 10;

  constructor(private dominionDataService: DominionDataService) {}

  async getRandomCards(
    settings: RandomizerSettings,
    count = this.defaultCount
  ): Promise<CompleteCard[]> {
    const types = settings.cardTypes || {};
    const features = settings.features || {};
    Object.keys(features).forEach(
      k => (features[k].pattern = new RegExp(features[k].pattern.source, 'gis'))
    );

    const targetExpansions$ = settings.includedExpansionKeys.map(k =>
      this.dominionDataService.getCompleteExpansion(k)
    );
    const expansions: CompleteExpansion[] = await forkJoin(
      targetExpansions$
    ).toPromise();

    const cards = this.getAllCards(expansions);
    const eligibleCards = this.exceptForbidden(cards, types, features);
    const shuffled = shuffle(eligibleCards);

    // if this is being used to replace a single card, ignore required constraint
    if (count !== this.defaultCount) {
      return this.sortAlphabetically(shuffled.slice(0, count));
    }

    const randomCards = [];
    const sidewaysCards = [];
    const requiredCardTypes = Object.keys(types).filter(k => types[k] === true);
    requiredCardTypes.forEach(t => {
      if (randomCards.find(c => this.isType(c, t))) {
        return;
      }
      if (randomCards.length === count) {
        throw new Error(
          `Can't fulfil all requested requirements within ${count} cards`
        );
      }
      const match = shuffled.find(c => this.isType(c, t));
      if (!match) {
        throw new Error(`Can't find a card matching the type ${t}`);
      }
      randomCards.push(match);
    });
    const requiredFeatures = Object.keys(features)
      .filter(k => features[k].enabled === true)
      .map(k => features[k]);
    requiredFeatures.forEach(f => {
      if (randomCards.find(c => this.hasFeature(c, f.pattern))) {
        return;
      }
      if (randomCards.length === count) {
        throw new Error(
          `Can't fulfil all requested requirements within ${count} cards`
        );
      }
      const match = shuffled.find(c => this.hasFeature(c, f.pattern));
      if (!match) {
        throw new Error(`Can't find a card matching the feature ${f.pattern}`);
      }

      randomCards.push(match);
    });

    if (settings.sidewaysCards === true) {
      sidewaysCards.push(shuffled.find(c => this.isSideways(c)));
    }

    while (randomCards.length < count) {
      const nextCard = shuffled.find(
        c =>
          // it's not an already selected kingdom card
          (!this.isSideways(c) && !randomCards.includes(c)) ||
          // or it's a sideways card that hasn't been selected and we have room for one more
          (this.isSideways(c) &&
            sidewaysCards.length < 2 &&
            !sidewaysCards.includes(c))
      );

      if (nextCard === null) {
        throw new Error('Ran out of cards :(');
      }

      if (this.isSideways(nextCard)) {
        sidewaysCards.push(nextCard);
      } else {
        randomCards.push(nextCard);
      }
    }

    return this.sortAlphabetically(randomCards.concat(sidewaysCards));
  }

  private sortAlphabetically(cards: CompleteCard[]) {
    return cards.slice().sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  private getAllCards(expansions: CompleteExpansion[], sideways?: boolean) {
    const allCards = expansions
      .map(e => e.cards)
      .reduce((prev, curr) => prev.concat(curr), [])
      .filter(
        c =>
          c.randomizer !== false || (sideways !== false && this.isSideways(c))
      );
    return allCards
      .map(c => allCards.filter(c1 => c1.card_tag === c.card_tag)[0])
      .filter((c, i) => allCards.indexOf(c) === i);
  }

  private exceptForbidden(
    cards: CompleteCard[],
    types: { [type: string]: boolean },
    features: { [feature: string]: { enabled: boolean; pattern: RegExp } }
  ): CompleteCard[] {
    const forbiddenCardTypes = Object.keys(types).filter(
      k => types[k] === false
    );
    cards = cards.filter(c => !forbiddenCardTypes.find(t => this.isType(c, t)));
    const forbiddenFeatures = Object.keys(features)
      .filter(k => features[k].enabled === false)
      .map(k => features[k]);

    cards = cards.filter(
      c => !forbiddenFeatures.find(f => this.hasFeature(c, f.pattern))
    );
    return cards;
  }

  private isSideways(card: CompleteCard) {
    return ['Event', 'Project', 'Landmark'].filter(t => card.types.includes(t))
      .length;
  }

  private isType(card: CompleteCard, type: string) {
    const types = type.split(' ');
    return types.filter(t => card.types.includes(t)).length === types.length;
  }

  private hasFeature(card: CompleteCard, pattern: RegExp) {
    return pattern.test(`${card.name} ${card.description} ${card.extra}`);
  }
}

// the Fisher-Yates (aka Knuth) Shuffle
// see https://stackoverflow.com/a/2450976/1396477
function shuffle<T>(array: T[]): T[] {
  array = array.slice();
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}
