import { browser, by, element, ElementFinder, WebElement } from 'protractor';
import { ExpansionSelectionDialogue } from './expansion-selection-dialogue.po';

export class RandomizerPage {
  navigateTo() {
    return browser.get('/randomizer');
  }

  isAt() {
    return element(
      by.css('hc-navbar-link a.active[title="Randomizer"]')
    ).isPresent();
  }

  get expansionSelectionButton() {
    return element(by.css('button[title="Change expansions"]'));
  }

  get expansionSelectionDialogue() {
    return new ExpansionSelectionDialogue();
  }
}
