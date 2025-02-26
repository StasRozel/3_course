const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

const HOME_URL =
  "https://course-project-jggs.onrender.com/components/home.html";
const SECOND = 1000;

async function testAuth(driver) {
  console.log("Начато тестирование авторизации...");
  await driver.get(
    "https://course-project-jggs.onrender.com/components/sign_in.html"
  );
  console.log("Перешли на страницу входа...");
  const usernameField = await driver.findElement(By.css(".input_login"));
  await usernameField.sendKeys("Stas");
  console.log("Ввели логин...");
  const passwordField = await driver.findElement(By.css(".input_password"));
  await passwordField.sendKeys("1234");
  console.log("Ввели пароль...");
  const loginButton = await driver.findElement(By.css(".button_log_in"));
  await loginButton.click();
  console.log("Нажали кнопку входа...");
  await driver.wait(until.urlIs(HOME_URL), 10 * SECOND);

  const currentUrl = await driver.getCurrentUrl();

  if (currentUrl === HOME_URL) {
    console.log("Авторизация прошла успешно");
  } else {
    console.error("Авторизация не удалась");
  }
}

async function testBooking(driver) {
  console.log("Начато тестирование бронирования...");
  await driver.get(HOME_URL);
  console.log("Перешли на домашнюю страницу...");
  const loginLink = await driver.findElement(By.css(".booking-menu"));
  await loginLink.click();
  console.log("Нажали на кнопку бронирование...");
  await driver.wait(
    until.urlIs(
      "https://course-project-jggs.onrender.com/components/booking.html"
    ),
    10 * SECOND
  );
  console.log("Перешли на страницу бронирования...");

  const where_from = await driver.findElement(By.css(".input_where_from"));
  await where_from.sendKeys("Минск");
  console.log("Ввели пункт посадки...");

  const where_to = await driver.findElement(By.css(".input_where_to"));
  await where_to.sendKeys("Орша");
  console.log("Ввели пункт высадки...");

  const searchButton = await driver.findElement(By.css(".button_search"));
  await searchButton.click();
  console.log("Нажали кнопку поиска...");

  const booking = await driver.findElement(By.css(".button_booking"));

  const isDisplayedBooking = await driver.wait(async () => {
    const isDisplayed = await booking.isDisplayed();
    return isDisplayed;
  }, 10 * SECOND);

  if (isDisplayedBooking) {
    console.log("Данный путь найден...");

    const timerInput = await driver.findElement(By.css(".input_date"));
    await timerInput.sendKeys("07:42");
    console.log("Вводим время...");

    const dropdown = await driver.findElement(By.css(".number_passangers"));
    await dropdown.click();
    console.log("Выбираем кол-во пассажиров...");

    const option = await driver.findElement(By.css("option[value='3']"));
    await option.click();
    console.log("Ставим кол-во пассажиров: 3...");

    await booking.click();
    console.log("Нажимаем кнопку забронировать...");
    const notification = await driver.findElement(By.css(".modal"));
    const opacityNotification = await driver.wait(async () => {
      const opacity = await driver.executeScript(
        "return window.getComputedStyle(arguments[0]).getPropertyValue('opacity');",
        notification
      );
      return opacity;
    }, 10 * SECOND);
    if (opacityNotification > 0) {
      console.log("Бронирование успешно выполнено");
    } else {
      console.error("Бронирование не выполнено");
    }
  } else {
    console.log("Данный путь не найден...");
  }
}

async function testSearh(driver) {
  console.log("Начато тестирование поиска по расписанию...");
  await driver.get(
    "https://course-project-jggs.onrender.com/components/table_train.html"
  );

  console.log("Перешли на страницу расписания...");

  const usernameField = await driver.findElement(By.css(".input_where_from"));
  await usernameField.sendKeys("Минск");
  console.log("Ввели пункт посадки...");

  const passwordField = await driver.findElement(By.css(".input_where_to"));
  await passwordField.sendKeys("Гудогай");
  console.log("Ввели пункт высадки...");

  const booking = await driver.findElement(By.css(".button_booking"));
  await booking.click();

  try {
    const isErrorMessage = await driver.wait(async () => {
      try {
        const errorElement = await driver.findElement(By.css(".error_message"));
        return errorElement;
      } catch (error) {
        return false;
      }
    }, SECOND / 10);

    if (isErrorMessage) {
      console.log("Путь не найден");
    }
  } catch (error) {
    console.log("Путь успешно найден");
  }
}

async function testFormElement(driver) {
  console.log("Начато тестирование формы...");
  await driver.get("https://demoqa.com/automation-practice-form");

  const firstName = await driver.findElement(By.id("firstName"));
  const lastName = await driver.findElement(By.id("lastName"));
  const radioButton = await driver.findElement(By.id("gender-radio-1"));
  const userNumber = await driver.findElement(By.id("userNumber"));
  const submit = await driver.findElement(By.id("submit"));


  await firstName.sendKeys('Stas');
  console.log('Вводим имя');
  await lastName.sendKeys('Rozel');
  console.log('Вводим фамилию');
  await driver.executeScript("arguments[0].click();", radioButton);
  console.log('Выбираем пол')
  await userNumber.sendKeys('+375292511122');
  console.log('Вводим номер телефона');
  submit.click();
  console.log('Отправляем данные');

  const modal = driver.wait(async() => {  
    return await driver.findElement(By.id("modal-content"));
  }, SECOND / 10);
  if (modal != undefined) {
    console.log('Форма успешно отправлена');
  } else {
    console.log('Форма не отправлена, проверьте корректность ввода');
  }
}

async function runWebTests() {
  let options = new firefox.Options();
  options.addArguments("-headless");
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  try {
    await testAuth(driver);
    await testBooking(driver);
    await testSearh(driver);
    await testFormElement(driver);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await driver.quit();
  }
}

runWebTests();
