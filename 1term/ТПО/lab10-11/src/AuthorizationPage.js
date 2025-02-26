const {SECOND, HOME_URL} = require('../global');
const { By, until } = require("selenium-webdriver");

class AuthorizationPage {
  _driver = null;
  _usernameField = null;
  _passwordField = null;
  _loginButton = null;
  _currentUrl = null;

  constructor() {
    
  }

  async init(driver) {
    this._driver = driver;

    console.log("Начато тестирование авторизации...");
    await this._driver.get(
      "https://course-project-jggs.onrender.com/components/sign_in.html"
    );
    console.log("Перешли на страницу входа...");
    this._usernameField = await this._driver.findElement(By.css(".input_login"));
    this._passwordField = await this._driver.findElement(By.css(".input_password"));
    this._loginButton = await this._driver.findElement(By.css(".button_log_in"));
  }
  async setUsernameField(username) {
    await this._usernameField.sendKeys(username);
    console.log("Ввели логин...");
  }

  async setPasswordField(password) {
    await this._passwordField.sendKeys(password);
    console.log("Ввели пароль...");
  }

  async clickLoginButton() {
    await this._loginButton.click();
    console.log("Нажали кнопку входа...");
  }

  async checkTestResult() {
    await this._driver.wait(until.urlIs(HOME_URL), 12 * SECOND);
    this._currentUrl = await this._driver.getCurrentUrl();
    if (this._currentUrl === HOME_URL) {
      console.log("Авторизация прошла успешно");
      return true;
    } else {
      console.error("Авторизация не удалась");
    }
  }
}

module.exports = AuthorizationPage;
