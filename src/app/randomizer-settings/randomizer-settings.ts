export interface RandomizerSettings {
  includedExpansionKeys: string[];
  cardTypes: { [type: string]: boolean };
  features: { [name: string]: { enabled: boolean; pattern: RegExp } };
}

export const defaultSettings: RandomizerSettings = {
  includedExpansionKeys: [],
  cardTypes: {},
  features: {}
};
