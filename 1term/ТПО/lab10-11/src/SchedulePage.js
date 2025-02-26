const {SECOND} = require('../global');
const { By, until } = require("selenium-webdriver");

class SchedulePage {
    _driver = null;
    _usernameField = null;
    _passwordField = null;
    _booking = null;
    constructor(driver) {
      this._driver = driver;
    }
  
    async init() {
      console.log("Начато тестирование поиска по расписанию...");
      await this._driver.get(
        "https://course-project-jggs.onrender.com/components/table_train.html"
      );
      console.log("Перешли на страницу расписания...");
  
      this._usernameField = await this._driver.findElement(By.css(".input_where_from"));
      this._passwordField = await this._driver.findElement(By.css(".input_where_to"));
      this._booking = await this._driver.findElement(By.css(".button_booking"));
    }

    async setFromCity(city) {
      await this._usernameField.sendKeys(city);
      console.log("Ввели пункт посадки...");
    }

    async setToCity(city) {
      await this._passwordField.sendKeys(city);
    console.log("Ввели пункт высадки...");
    }

    async clickBooking() {
      await this._booking.click();
      console.log("Нажали кнопку поиска...");
    }

    async _checkMessage() {
      return await this._driver.wait(async () => {
        try {
          const errorElement = await this._driver.findElement(By.css(".error_message"));
          console.log(errorElement);
          return errorElement;
        } catch (error) {
          return false;
        }
      }, SECOND / 10);
    }

    async checkRoute() {
      try {
        if (await this._checkMessage()) {
          console.log("Путь не найден");
          return false;
        }
      } catch (error) {
        console.log("Путь успешно найден");
        return true;
      }
    }
}

module.exports = SchedulePage;