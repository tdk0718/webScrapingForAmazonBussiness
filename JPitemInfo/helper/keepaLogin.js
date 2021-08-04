import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function keepaLogin(driver) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.get('https://keepa.com/#')
      await driver.wait(until.elementLocated(By.id('panelUserRegisterLogin')), 10000)
      await driver.findElement(By.id('panelUserRegisterLogin')).click()
      await driver.findElement(By.id('username')).sendKeys('t.matsushita0718@gmail.com')
      await driver.findElement(By.id('password')).sendKeys('tadaki4281')
      await driver.findElement(By.id('submitLogin')).click()
      return resolve('ok')
    } catch (e) {
      reject(e)
    }
  })
}
