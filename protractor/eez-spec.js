/* global browser */
/* global by */
/* global describe */
/* global element */
/* global expect */
/* global it */
/* global protractor */
/* global $ */

'use strict';

/* to run these tests, first start a selenium driver :

install first if you haven't:

webdriver-manager  update

webdriver-manager start
*/

describe('SAU app', function() {

  it('should redirect to eezs on / request', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch('/eez');
  });

  it('should redirect to Australia detail page when AUS typed in search', function() {
    browser.get('index.html');
    var e = element(by.css('.ui-select-container'));
    e.click();
    var input = $('.ui-select-container input.form-control');
    input.sendKeys('AUS');
    input.sendKeys(protractor.Key.ENTER);
    expect(browser.getLocationAbsUrl()).toMatch('/eez/36');
  });

  it('should render LME detail page', function() {
    browser.get('index.html');
    var lmeButton = element(by.partialLinkText('LME'));
    lmeButton.click();

    var e = element(by.css('.ui-select-container'));
    e.click();
    var input = $('.ui-select-container input.form-control');
    input.sendKeys('aleutian');
    input.sendKeys(protractor.Key.ENTER);
    expect(browser.getLocationAbsUrl()).toMatch('/lme/65');
  });

  it('should render LME MNF', function() {
    browser.get('/#/lme/65');
    var indicatorsTab = element(by.partialLinkText('Indicators'));
    indicatorsTab.click();

    var e = element(by.partialLinkText('Multinational footprint'));
    e.click();
    var chartElement = element(by.css('[ng-controller="MultinationalFootprintCtrl"]'));
    expect(chartElement.isPresent()).toBe(true);
  });

});
