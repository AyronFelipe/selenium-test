const { Builder, By, Key, until } = require('selenium-webdriver');

function formataCPF(cpf) {
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

(async function testCPFSicar() {
    let driver = await new Builder().forBrowser('firefox').build();
    const result = [];
    const cpf = `07919727391`
    try {
        await driver.get('http://www.car.gov.br/#/central/acesso');
        await driver.sleep(2000);
        const cpfElement = await driver.findElement(By.className('ng-valid-maxlength '))
        cpfElement.clear();
        cpfElement.click();
        cpfElement.sendKeys(formataCPF(cpf), Key.TAB);
        await driver.sleep(1000);
        const passwordElement = await driver.findElement(By.css(`input[type='password'][ng-model='senha']`))
        //passwordElement.sendKeys(cpf.substring(0, 6));
        passwordElement.sendKeys(cpf);
        await driver.sleep(1000);
        await driver.findElement(By.className('central-botao')).click();
        await driver.sleep(15000);
        await driver.wait(until.elementTextIs(driver.findElement(By.className('perfil')), 'Proprietário Possuidor'), 1000);
        result.push({
            'cpf': cpf,
            'success': true
        })
    } catch (error) {
        console.log(`ERROR: ${error}`);
        result.push({
            'cpf': cpf,
            'success': false
        })
    } finally {
        console.log(result);
        if (driver) {
            await driver.quit()
        }
    }
})();