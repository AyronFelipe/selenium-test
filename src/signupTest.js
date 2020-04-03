const { Builder, By, Key, until } = require('selenium-webdriver');
require('dotenv').config();
var FormData = require('form-data');
var axios = require('axios').default;

function formataCPF(cpf) {
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

async function set(driver, value, name) {
    const element = await driver.findElement(By.name(name));
    element.clear();
    element.sendKeys(value);
    await driver.sleep(2000);
}

async function setViaJquery(driver, classe, value) {
    await driver.executeScript(`$(".${classe}").val("${value}")`);
    await driver.sleep(2000);
}

async function setCelular(driver, value) {
    await driver.executeScript(`$("#id_telefone[numero]").val('${value}')`);
    await driver.sleep(2000);
}

(
    async function signupTest() {
        let driver = await new Builder().forBrowser('firefox').build();
        try {
            await driver.get(process.env.URL)
            await driver.findElement(By.className('btn btn-sm btn-purple')).click();
            const form = new FormData();
            form.append('acao', 'gerar_pessoa');
            form.append('sexo', 'I');
            form.append('idade', '0');
            form.append('cep_estado', 'PI');
            form.append('txt_qtde', '1');
            form.append('cep_cidade', '5721');
            const formHeaders = form.getHeaders();
            const response = await axios.post('https://www.4devs.com.br/ferramentas_online.php', form, {
                headers: {...formHeaders,}
            });
            const { cpf, nome, data_nasc, email, celular, cep, endereco, numero, bairro, cidade } = response.data;
            await set(driver, nome, 'pessoafisica[nome]');
            await setViaJquery(driver, 'cpf', cpf);
            await driver.findElement(By.xpath("//select/option[@value='SO']")).click();
            await set(driver, email, 'email');
            await set(driver, process.env.PASSWORD, 'password1');
            await set(driver, process.env.PASSWORD, 'password2');
            await driver.findElement(By.xpath("//select/option[@value='U']")).click();
            await setViaJquery(driver, 'cep', cep);
            await setViaJquery(driver, 'cep-logradouro', endereco);
            await setViaJquery(driver, 'cep-bairro', bairro);
            await setViaJquery(driver, 'cep-municipio', cidade);
            await set(driver, numero, 'endereco[enderecourbano][numero]');
            await setViaJquery(driver, 'telefone', celular);
            //Documento CPF e Documento Oficial com Foto. Ver como fazer
            console.log('SUCCESS!!')
        } catch (error) {
            console.log(`ERROR: ${error}`);
        } finally {
            if (driver) {
                //await driver.quit()
            }
        }
    }
)();