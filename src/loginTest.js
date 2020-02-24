const { Builder, By, Key } = require('selenium-webdriver');
require('dotenv').config();

async function setCpf(driver, value){
    await driver.executeScript(`$("#cpf").val('${value}')`);
}

async function setPassword(driver, value) {
    const passwordElement = await driver.findElement(By.name('password'))
    passwordElement.clear();
    passwordElement.click();
    passwordElement.sendKeys(value, Key.ENTER);
}

(async function loginTest() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get('http://localhost:8000');
        await driver.findElement(By.className('btn btn-sm btn-success')).click();
        await setCpf(driver, process.env.CPF);
        await setPassword(driver, process.env.PASSWORD);
    } catch (error) {
        console.log(error);
    } finally {
        //driver.quit()
    }
})();