import { element, by, ElementFinder } from 'protractor';
import { Checkbox } from '../checkBox.po';

export class ExpansionSelectionDialogue {
  private baseSelector = element(by.css('app-expansion-selection'));

  isPresent() {
    return this.baseSelector.isPresent();
  }
  get clearSelectionButton() {
    return this.baseSelector.element(
      by.xpath('//button[text()="Clear Selection"]')
    );
  }
  async selectExpansions(value: string[]) {
    await this.clearSelectionButton.click();
    const checkBoxes = await this.getExpansionCheckboxes();
    for (let i = 0; i < checkBoxes.length; i++) {
      const text = await checkBoxes[i].text;
      if (!value.includes(text)) {
        continue;
      }
      await checkBoxes[i].check();
    }
  }

  async getExpansionCheckboxes() {
    const checkBoxes = (await this.baseSelector.$$(
      'hc-checkbox'
    )) as ElementFinder[];
    return checkBoxes.map(value => new Checkbox(value));
  }
  get saveButton() {
    return this.baseSelector.element(by.xpath('//button[text()="Save"]'));
  }
}
