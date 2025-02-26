const { SECOND } = require("../global");
const { By, until } = require("selenium-webdriver");

class BookingPage {
  _driver = null;
  _where_from = null;
  _where_to = null;
  _searchButton = null;
  _booking = null;
  _timerInput = null;
  _dropdown = null;
  _option = null;
  _notification = null;

  constructor(driver) {
    this._driver = driver;
  }

  async init() {
    console.log("Перешли на страницу бронирования...");
    await this._driver.get(
      "https://course-project-jggs.onrender.com/components/booking.html"
    );
    this._where_from = await this._driver.findElement(
      By.css(".input_where_from")
    );
    this._where_to = await this._driver.findElement(By.css(".input_where_to"));
    this._searchButton = await this._driver.findElement(
      By.css(".button_search")
    );
    this._booking = await this._driver.findElement(By.css(".button_booking"));
    this._timerInput = await this._driver.findElement(By.css(".input_date"));
    this._dropdown = await this._driver.findElement(
      By.css(".number_passangers")
    );
    this._option = await this._driver.findElement(By.css("option[value='3']"));
    this._notification = await this._driver.findElement(By.css(".modal"));
  }

  async setWhereFrom(where_from) {
    await this._where_from.sendKeys(where_from);
    console.log("Ввели пункт посадки...");
  }

  async setWhereTo(where_to) {
    await this._where_to.sendKeys(where_to);
    console.log("Ввели пункт высадки...");
  }

  async clickSearch() {
    await this._searchButton.click();
    console.log("Нажали кнопку поиска...");
  }

  async _isDisplayedBooking() {
    return await this._driver.wait(async () => {
      const isDisplayed = await this._booking.isDisplayed();
      return isDisplayed;
    }, 10 * SECOND);
  }

  async _setTime(time) {
    await this._timerInput.sendKeys(time);
    console.log("Вводим время...");
  }

  async _clickDropdown() {
    await this._dropdown.click();
    console.log("Выбираем кол-во пассажиров...");
  }

  async _clickOption() {
    await this._option.click();
    console.log("Ставим кол-во пассажиров: 3...");
  }

  async _clickBooking() {
    await this._booking.click();
    console.log("Нажимаем кнопку забронировать...");
  }

  async _checkOpacity() {
    return await this._driver.wait(async () => {
      const opacity = await this._driver.executeScript(
        "return window.getComputedStyle(arguments[0]).getPropertyValue('opacity');",
        this._notification
      );
      return opacity;
    }, 10 * SECOND);
  }

  async _checkNotification(opacityNotification) {
    if (opacityNotification > 0) {
      console.log("Бронирование успешно выполнено");
    } else {
      console.error("Бронирование не выполнено");
    }
  }

  async checkRoute(time) {
    if (await this._isDisplayedBooking()) {
      await this._setTime(time);
      await this._clickDropdown();
      await this._clickOption();
      await this._clickBooking();
      await this._checkNotification(await this._checkOpacity());

      console.log("Данный путь найден...");
      return true;
    } else {
      console.log("Данный путь не найден...");
    }
  }
}

module.exports = BookingPage;
