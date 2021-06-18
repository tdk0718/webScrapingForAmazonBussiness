import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function getTextByCss(driver, css) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await driver.findElement(By.css(css)).getText()
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function waitEl(driver, css, seconds) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), seconds)
      resolve('ok')
    } catch (e) {
      reject(e)
    }
  })
}

export function getAttrByCss(driver, css, attr) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await driver.findElement(By.css(css)).getAttribute(attr)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function countEls(driver, css) {
  return new Promise(async (resolve, reject) => {
    try {
      const el = await driver.findElements(By.css(css))
      resolve(el.length)
    } catch (e) {
      reject(e)
    }
  })
}
