export interface Card {
    card_tag: string;
    cardset_tags: string[];
    cost: string;
    group_tag: string;
    randomizer?: boolean;
    types: string[];
    count?: string;
    potcost?: string;
}

export type CompleteCard = Card & CardText;

export interface LocaleCardTextMap {
    [cardKey: string]: CardText;
}

export interface CardText {
    description: string;
    extra: string;
    name: string;
    untranslated?: string;
}
