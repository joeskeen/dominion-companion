import { WebElement, by } from 'protractor';

export class Checkbox {
  constructor(private selector: WebElement) {}

  get isChecked(): Promise<boolean> {
    return (this.selector as any).element(by.css('input')).isSelected();
  }

  async check() {
    if (!(await this.isChecked)) {
      (this.selector as any).element(by.css('.hc-checkbox-overlay')).click();
    }
  }

  async uncheck() {
    if (await this.isChecked) {
      (this.selector as any).element(by.css('.hc-checkbox-overlay')).click();
    }
  }

  get text(): Promise<string> {
    return (this.selector as any)
      .element(by.css('.hc-checkbox-label'))
      .getText();
  }
}
