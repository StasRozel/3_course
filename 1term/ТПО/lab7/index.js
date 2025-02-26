const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
async function findBySelector(driver, selectors) {
  const element1 = await driver.findElement(By.css(selectors[0]));
  console.log(`Element found: ${await element1.getText()}`);
  const element2 = await driver.findElements(By.css(selectors[1]));
  for (const element of element2) {
    console.log(`Element text: ${await element.getText()}`);
  }

  const element3 = await driver.findElement(By.css(selectors[2]));
  console.log(`Element found: ${await element3.getText()}`);
}

async function findByXPath(driver, selectors) {
  const element1 = await driver.findElement(By.xpath(selectors[0]));
  console.log(`Element found: ${await element1.getText()}`);

  const element2 = await driver.findElements(By.xpath(selectors[1]));
  for (const element of element2) {
    console.log(`Element text: ${await element.getText()}`);
  }

  const element3 = await driver.findElement(By.xpath(selectors[2]));
  console.log(`Element found: ${await element3.getText()}`);
}
async function findByTagName(driver, selector) {
  const selectors = await driver.findElements(By.tagName(selector));

for (const selector of selectors) {
  console.log(`Element found: ${await selector.getText()}`);
}
}
async function findByPartialLink(driver, partialLink) {
  const readMoreLinks = await driver.findElements(
    By.partialLinkText(partialLink)
  );

  for (const link of readMoreLinks) {
    console.log(`URL link: ${await link.getAttribute("href")}`);
  }
}
async function runWebTest() {
  let options = new firefox.Options();
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  try {
    const websiteUrl = "https://course-project-jggs.onrender.com/";
    await driver.get(websiteUrl);

    console.log("Finding elements using CSS selectors: \n");

    const selectors = [
      "header > div > p",
      "main > section.block-cards > .cards > div",
      "footer > p",
    ];
    await findBySelector(driver, selectors);

    console.log("Finding elements using XPath selectors: \n");

    const xpaths = [
      "html/body/main/section[1]/div/div[2]/p",
      "html/body/main/section[1]/div/div[3]/div",
      "html/body/main/section[3]/div/p[1]",
    ];
    await findByXPath(driver, xpaths);

    console.log("Finding elements using tag element: \n");
    
    await findByTagName(driver, 'section');

    console.log("Finding elements using partial link: \n");

    await findByPartialLink(driver, "Перейти к расписанию");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.quit();
  }
}

runWebTest();
