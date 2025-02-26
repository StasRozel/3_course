const {SECOND} = require('../global');
const { By, until } = require("selenium-webdriver");
const fs = require("fs");

class TestElementsPage {
    _driver = null;
    _firstName = null;
    _lastName = null;
    _radioButton = null;
    _userNumber = null;
    _submit = null;
    constructor(driver) {
        this._driver = driver;
    }
  
    async init() {
      console.log("Начато тестирование формы...");
      await this._driver.get("https://demoqa.com/automation-practice-form");
  
      this._firstName = await this._driver.findElement(By.id("firstName"));
      this._lastName = await this._driver.findElement(By.id("lastName"));
      this._radioButton = await this._driver.findElement(By.id("gender-radio-1"));
      this._userNumber = await this._driver.findElement(By.id("userNumber"));
      this._submit = await this._driver.findElement(By.id("submit"));
    }

    async setFirstName(firstName) {
        await this._firstName.sendKeys(firstName);
    console.log('Вводим имя');
    }

    async setLastName(lastName) {
        await this._lastName.sendKeys(lastName);
        console.log('Вводим фамилию');
    }

    async selectGender() {
        await this._driver.executeScript("arguments[0].click();", this._radioButton);
        console.log('Выбираем пол');
    }

    async setNumber(number) {
        await this._userNumber.sendKeys(number);
        console.log('Вводим номер телефона');
    }

    async submitData() {
        await this._driver.executeScript("arguments[0].scrollIntoView(true);", this._submit);
        this._submit.click();
        console.log('Отправляем данные');
    }

    async _checkModal(modal) {
        const isDisplayed = await modal.isDisplayed();
            
        if (isDisplayed) {
            await this._takeScreenshot('screenshot.png');
            console.log('Форма успешно отправлена');
            return true;
        } else {
            console.log('Форма не отправлена, проверьте корректность ввода');
            return false;
        }
    }

    async _takeScreenshot(filePath) {
        const screenshot = await this._driver.takeScreenshot();
        fs.writeFileSync(filePath, screenshot, 'base64');
    }

    async getModalElement() {
        try {
            const modal = await this._driver.wait(
                until.elementLocated(By.css(".modal-content")),
                SECOND
            );
            
            await this._checkModal(modal);
    
        } catch (error) {
            console.error('Ошибка при ожидании элемента:', error);
            console.log('Форма не отправлена, проверьте корректность ввода');
        }
    }

    
}

module.exports = TestElementsPage;