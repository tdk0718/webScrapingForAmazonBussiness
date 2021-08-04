import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function createDriver(capabilities) {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = await new Builder().withCapabilities(capabilities).build()
      return resolve(driver)
    } catch (e) {
      reject(e)
    }
  })
}

export function getTextByCss(driver, css) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await driver.findElement(By.css(css)).getText()
      return resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function waitEl(driver, css, seconds) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), seconds)
      return resolve('ok')
    } catch (e) {
      reject(e)
    }
  })
}

export function getAttrByCss(driver, css, attr) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await driver.findElement(By.css(css)).getAttribute(attr)
      return resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function countEls(driver, css) {
  return new Promise(async (resolve, reject) => {
    try {
      const el = await driver.findElements(By.css(css))
      return resolve(el.length)
    } catch (e) {
      reject(e)
    }
  })
}
