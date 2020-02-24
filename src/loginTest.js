const { Builder, By, Key, until } = require('selenium-webdriver');
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
        await driver.get(process.env.URL);
        await driver.findElement(By.className('btn btn-sm btn-success')).click();
        await setCpf(driver, process.env.CPF);
        await setPassword(driver, process.env.PASSWORD);
        await driver.sleep(2500);
        await driver.wait(until.elementTextIs(driver.findElement(By.className('page-title')), 'Página Inicial'), 1000);
        console.log('SUCCESS!!')
    } catch (error) {
        console.log(`ERROR: ${error}`);
    } finally {
        if (driver) {
            await driver.quit()
        }
    }
})();