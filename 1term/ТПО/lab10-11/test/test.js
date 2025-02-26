const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const chrome = require("selenium-webdriver/chrome");
const AuthorizationPage = require("./../src/AuthorizationPage");
const BookingPage = require("./../src/BookingPage");
const SchedulePage = require("./../src/SchedulePage");
const TestElementsPage = require("./../src/TestElementsPage");
const assert = require('assert');
const Mocha = require('mocha');
const fixtures = require('../fixtures');

const mocha = new Mocha({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: './reports',
    reportFilename: 'test-report',
    quiet: true,
    overwrite: true,
    html: true,
    json: true
  },
});

mocha.addFile('./test/test.js');

async function testAuth(driver) {
  const authorizationPage = new AuthorizationPage();
  await authorizationPage.init(driver);
  await authorizationPage.setUsernameField(fixtures.auth.username);
  await authorizationPage.setPasswordField(fixtures.auth.password);
  await authorizationPage.clickLoginButton();
  return await authorizationPage.checkTestResult();
}

async function testBooking(driver) {
  const bookingPage = new BookingPage(driver);
  await bookingPage.init();
  await bookingPage.setWhereFrom(fixtures.booking.fromCity);
  await bookingPage.setWhereTo(fixtures.booking.toCity);
  await bookingPage.clickSearch();
  return await bookingPage.checkRoute(fixtures.booking.expectedTime);
}

async function testSearch(driver) {
  const schedulePage = new SchedulePage(driver);
  await schedulePage.init();
  await schedulePage.setFromCity(fixtures.schedule.fromCity);
  await schedulePage.setToCity(fixtures.schedule.toCity);
  await schedulePage.clickBooking();
  return await schedulePage.checkRoute();
}

async function testFormElement(driver) {
  const testElementsPage = new TestElementsPage(driver);
  await testElementsPage.init();
  await testElementsPage.setFirstName(fixtures.form.firstName);
  await testElementsPage.setLastName(fixtures.form.lastName);
  await testElementsPage.selectGender();
  await testElementsPage.setNumber(fixtures.form.phoneNumber);
  await testElementsPage.submitData();
  return await testElementsPage.getModalElement();
}

describe('Web Tests', function() {
  let driver;

  before(async function() {
    try {
      let options = new firefox.Options();
      fixtures.driver_firefox.args.forEach(arg => options.addArguments(arg));
      fixtures.driver_firefox.extensions.forEach(ext => options.addExtensions(ext));
      
      driver = await new Builder()
        .forBrowser(fixtures.driver_firefox.browser)
        .setFirefoxOptions(options)
        .build();
    } catch (error) {
      console.error('Failed to initialize driver:', error);
      throw error;
    }
  });

  // before(async function() {
  //   try {
  //     let options = new chrome.Options();
  //     fixtures.driver_chrome.args.forEach(arg => options.addArguments(arg));
  //     fixtures.driver_chrome.extensions.forEach(ext => options.addExtensions(ext));
      
  //     driver = await new Builder()
  //       .forBrowser(fixtures.driver_chrome.browser)
  //       .setChromeOptions(options)
  //       .build();
  //   } catch (error) {
  //     console.error('Failed to initialize driver:', error);
  //     throw error;
  //   }
  // });

  after(async function() {
    if (driver) {
      try {
        await driver.quit();
      } catch (error) {
        console.error('Failed to quit driver:', error);
      }
    }
  });

  it('Authorization test', async function() {
    const result = await testAuth(driver);
    assert.strictEqual(result, true);
  });

  it('Booking test', async function() {
    const result = await testBooking(driver);
    assert.strictEqual(result, true);
  });

  it('Search test', async function() {
    const result = await testSearch(driver);
    assert.strictEqual(result, true);
  });

  it('Form elements test', async function() {
    const result = await testFormElement(driver);
    assert.strictEqual(result, true);
  });
});

mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;
});