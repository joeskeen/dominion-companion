import { CardText, Card, CompleteCard } from './card';

export interface Expansion {
    edition: string[];
    image: string;
    set_name: string;
    set_text: string;
    text_icon: string;
    fan?: boolean;
    no_randomizer?: boolean;
    key?: string;
}

export interface CompleteExpansion extends Expansion, ExpansionText {
    cards: Array<CompleteCard>;
}

export interface ExpansionMap {
    [setKey: string]: Expansion;
}

export interface LocaleExpansionTextMap {
    [setKey: string]: ExpansionText;
}

export interface ExpansionText {
    set_name: string;
    set_text: string;
    text_icon: string;
    short_name?: string;
    untranslated?: string;
}
