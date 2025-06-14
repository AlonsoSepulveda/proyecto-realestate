import { Builder, By, until } from 'selenium-webdriver';

(async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:5173/');
    await driver.findElement(By.name('email')).sendKeys('asepulveda@planok.com');
    await driver.findElement(By.name('password')).sendKeys('As12345$');
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log('Prueba login OK!');
  } finally {
    await driver.quit();
  }
})();
