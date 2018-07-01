export interface Type {
    card_type: string[];
    card_type_image: string;
    defaultCardCount: number;
    tabCostHeightOffset: number;
    tabTextHeightOffset: number;
}

export interface LocaleTypeTextMap {
    [typeKey: string]: string;
}
