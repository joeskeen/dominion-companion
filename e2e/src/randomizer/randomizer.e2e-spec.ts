import { RandomizerPage } from './randomizer.po';
import { async } from 'q';

describe('randomizer page', () => {
  let page: RandomizerPage;

  beforeEach(() => {
    page = new RandomizerPage();
    page.navigateTo();
  });

  it('should navigate to randomizer page', () => {
    expect(page.isAt()).toEqual(true);
  });

  describe('expansion selection', () => {
    beforeEach(() => {
      page.expansionSelectionButton.click();
    });

    it('should open expansion selection dialogue when expansion selection button is clicked', () => {
      expect(page.expansionSelectionDialogue.isPresent()).toBe(true);
    });

    it('should show all Dominion expansions', async () => {
      const expansions = await page.expansionSelectionDialogue.getExpansionCheckboxes();
      const expansionNames = [];
      for (let i = 0; i < expansions.length; i++) {
        expansionNames.push(await expansions[i].text);
      }
      expect(expansionNames).toEqual([
        'Adventures',
        'Alchemy',
        'Animals',
        'Cornucopia',
        'Dark Ages',
        'Dominion 1st Edition',
        'Dominion 2nd Edition',
        'Dominion 2nd Edition Upgrade',
        'Empires',
        'Guilds',
        'Hinterlands',
        'Intrigue 1st Edition',
        'Intrigue 2nd Edition',
        'Intrigue 2nd Edition Upgrade',
        'Nocturne',
        'Promo',
        'Prosperity',
        'Seaside'
      ]);
    });
    describe('saving expansion selection', () => {
      const expansions = [
        'Dominion 1st Edition',
        'Animals',
        'Nocturne',
        'Cornucopia'
      ];
      beforeEach(async () => {
        await page.expansionSelectionDialogue.selectExpansions(expansions);
        await page.expansionSelectionDialogue.saveButton.click();
      });
      it('should preseve selction after reopening dialogue', async () => {
        await page.expansionSelectionButton.click();
        const checkboxes = await page.expansionSelectionDialogue.getExpansionCheckboxes();
        for (let i = 0; i < checkboxes.length; i++) {
          const text = await checkboxes[i].text;
          if (expansions.includes(text)) {
            expect(checkboxes[i].isChecked).toBe(true);
          } else {
            expect(checkboxes[i].isChecked).toBe(false);
          }
        }
      });
      it('should preserve selection after reloading page', async () => {
        await page.navigateTo();
        await page.expansionSelectionButton.click();
        const checkboxes = await page.expansionSelectionDialogue.getExpansionCheckboxes();
        for (let i = 0; i < checkboxes.length; i++) {
          const text = await checkboxes[i].text;
          if (expansions.includes(text)) {
            expect(checkboxes[i].isChecked).toBe(true);
          } else {
            expect(checkboxes[i].isChecked).toBe(false);
          }
        }
      });
    });
  });
});
